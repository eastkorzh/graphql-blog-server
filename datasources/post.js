const { DataSource } = require('apollo-datasource');
const { ApolloError } = require('apollo-server');
const Post = require('../models/Post');
const Draft = require('../models/Draft');
const User = require('../models/User');
const verify = require('../utils/verifyToken');
const cloudinary = require('cloudinary').v2;

const isAuthor = async (userId, postId) => {
  const user = await User.findById(userId);

  let isAuthor = false;

  if (user.posts) {
    for (let userPostId of user.posts) {
      if (`${userPostId}` === `${postId}`) {
        isAuthor = true;
        break;
      }
    }
  }

  if (user.drafts) {
    for (let userPostId of user.drafts) {
      if (`${userPostId}` === `${postId}`) {
        isAuthor = true;
        break;
      }
    }
  }

  if (!isAuthor) throw new ApolloError(`User '${user.email}' is not an author of this post`)

  return user;
}

class PostAPI extends DataSource {
  initialize(config) {
    this.token = config.context.token;
  }

  async createDraft({ title, content, _id }) {
    const token = verify(this.token);

    const draft = new Draft({
      _id,
      title,
      content,
      author: token._id
    })
    
    const savedDraft = await draft.save();

    await User.updateOne(
      { _id: token._id },
      { $push: { drafts: savedDraft._doc._id }}
    )

    return savedDraft;
  }

  async updateDraft({ title, content, cover, _id}) {
    const token = verify(this.token);

    const author = await isAuthor(token._id, _id);
    const date = new Date().getTime();

    await Draft.updateOne(
      { _id },
      { $set: {
        title,
        content,
        date,
        cover,
      }}
    )

    return {
      _id,
      title,
      content,
      author,
      date,
      originalPost: null,
      cover,
    }
  }

  async deleteDraft({ _id }) {
    const token = verify(this.token);

    const author = await isAuthor(token._id, _id);

    const filteredDrafts = author._doc.drafts.filter(itemId => `${itemId}` !== `${_id}`);
 
    await Draft.deleteOne({ _id });
    
    await User.updateOne(
      { _id: token._id },
      [
        { $unset: [ "drafts" ]},
        { $set: { drafts: filteredDrafts }}
      ]
    )

    const user = await User.findById(token._id).populate('posts').populate('drafts');

    return user;
  }

  async getAllDrafts() {
    verify(this.token);

    const findedDraft = await Draft.find().populate('author')

    return findedDraft;
  }

  async getDraft({ _id }) {
    verify(this.token);

    const draft = await Draft.findById(_id).populate('author')

    return draft;
  }

  async publishDraft({ _id }) {
    const token = verify(this.token);

    const author = await isAuthor(token._id, _id);
    const filteredDrafts = author._doc.drafts.filter(itemId => `${itemId}` !== `${_id}`);
    
    const draft = await Draft.findById(_id); 
    const post = new Post({
      ...draft._doc
    }) 

    await Draft.deleteOne({ _id });
    await User.updateOne(
      { _id: token._id },
      [
        { $unset: [ "drafts" ]},
        { $set: { drafts: filteredDrafts }},
      ]
    )
    
    await post.save();
    await User.updateOne(
      { _id: token._id },
      { $push: { posts: _id }},
    )
    
    const updatedUser = await User.findById(token._id).populate('posts').populate('drafts');

    return updatedUser;
  }

  async editPost({ postId, draftId }) {
    const token = verify(this.token);

    const author = await isAuthor(token._id, postId);
    const currentPost = await Post.findById(postId);

    const draft = new Draft({
      ...currentPost._doc,
      _id: draftId,
      date: new Date().getTime(),
      originalPost: postId,
    })
    
    const savedDraft = await draft.save();

    await User.updateOne(
      { _id: token._id },
      { $push: { drafts: savedDraft._doc._id }}
    )
    
    const updatedUser = await User.findById(token._id).populate('drafts');

    return updatedUser
  }

  async updatePost({ originalPost, draftId, title, content, cover }) {
    const token = verify(this.token);

    const user = await User.findById(token._id);

    // remove draft
    let isDraftAuthor = false;
  
    if (user.drafts) {
      for (let userPostId of user.drafts) {
        if (`${userPostId}` === `${draftId}`) {
          isDraftAuthor = true;
          break;
        }
      }
    }
  
    if (!isDraftAuthor) throw new ApolloError(`User '${user.email}' is not an author of this post`)
  
    const filteredDrafts = user._doc.drafts.filter(itemId => `${itemId}` !== `${draftId}`);

    await Draft.deleteOne({ draftId });
    
    await User.updateOne(
      { _id: token._id },
      [
        { $unset: [ "drafts" ]},
        { $set: { drafts: filteredDrafts }}
      ]
    )

    // update of create post
    let isPostExists = false;

    if (user.posts) {
      for (let userPostId of user.posts) {
        if (`${userPostId}` === `${originalPost}`) {
          isPostExists = true;
          break;
        }
      }
    }

    const date = new Date().getTime();

    if (isPostExists) {
      await Post.updateOne(
        { _id: originalPost },
        { $set: {
          title,
          content,
          date,
          cover,
        }}
      )
    } else {
      const post = new Post({
        _id: originalPost,
        title,
        content,
        cover,
        date,
        author: token._id
      }) 

      const savedPost = await post.save();

      await User.updateOne(
        { _id: token._id },
        { $push: { posts: savedPost._doc._id }}
      )
    }

    // result
    const updatedUser = await User.findById(token._id).populate('posts').populate('drafts');

    return updatedUser;
  }
 
  async getPost(_id) {
    const post = await Post.findById(_id).populate('author')

    return post;
  }

  async getAllPosts() {
    const findedPosts = await Post.find().sort({ date: -1 }).populate('author')

    return findedPosts;
  }

  async getPost(id) {
    const post = await Post.findById(id).populate('author')

    return post;
  }

  async deletePost({ _id }) {
    const token = verify(this.token);

    const author = await isAuthor(token._id, _id);

    const filteredPosts = author._doc.posts.filter(itemId => `${itemId}` !== `${_id}`);
    
    await Post.deleteOne({ _id });
    
    await User.updateOne(
      { _id: token._id },
      [
        { $unset: [ "posts" ]},
        { $set: { posts: filteredPosts }}
      ]
    )

    const user = await User.findById(token._id).populate('posts').populate('drafts');

    return user;
  }

  async addPhoto({ file, id }) {
    verify(this.token);

    const { createReadStream } = await file;
    
    const stream = createReadStream();

    const url = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream({ 
        tags: 'post_photo',
        width: 1200,
        crop: "limit",
      }, (err, image) => {
        resolve(image.url)
      })

      // If there's an error writing the file, remove the partially written file
      // and reject the promise.
      upload_stream.on('error', error => reject(error));
  
      // In node <= 13, errors are not automatically propagated between piped
      // streams. If there is an error receiving the upload, destroy the write
      // stream with the corresponding error.
      stream.on('error', error => upload_stream.destroy(error))
  
      stream.pipe(upload_stream)
    });

    return {
      url,
      id,
    };
  }
}

module.exports = PostAPI;
