const { DataSource } = require('apollo-datasource');
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
}

module.exports = PostAPI;
