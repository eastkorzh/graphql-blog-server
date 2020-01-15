const { DataSource } = require('apollo-datasource');
const { ApolloError } = require('apollo-server');
const Post = require('../models/Post');
const User = require('../models/User');
const verify = require('../utils/verifyToken');

class PostAPI extends DataSource {
  initialize(config) {
    this.token = config.context.token;
  }

  async getAllPosts() {
    const findedPosts = await Post.find().populate('author')

    return findedPosts;
  }

  async getPost(id) {
    const post = await Post.findById(id).populate('author')

    return post;
  }

  async makePost({ title, description, content }) {
    const token = verify(this.token);

    const post = new Post({
      title,
      description,
      content,
      author: token._id
    })

    const savedPost = await post.save();

    const updatedUser = await User.updateOne(
      { _id: token._id },
      { $push: { posts: token._id }}
    )

    return savedPost;
  }

  async editPost({ id, title, description, content }) {
    
    const token = verify(this.token);

    const user = await User.findById(token._id);

    let isAuthor = false;

    console.log(user.posts, id)
    debugger

    if (user.posts) {
      for (let postId of user.posts) {
        if (id === postId) {
          isAuthor = true;
          break;
        }
      }
    }

    if (!isAuthor) throw new ApolloError(`User '${user.email}' is not an author of this post`)
    
    const toUpdate = {
      title,
      description,
      content,
    };

    const filteredToUpdate = {}

    for (let item in toUpdate) {
      if (toUpdate[item]) {
        filteredToUpdate[item] = toUpdate[item];
      }
    }

    const isUpdated = await Post.updateOne(
      { _id: id },
      { $set: filteredToUpdate }
    );
    
    const updatedPost = await Post.findById(id).populate('author');

    return updatedPost;
  }
}

module.exports = PostAPI;
