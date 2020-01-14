const { DataSource } = require('apollo-datasource');
const User = require('../models/User');
const verify = require('../utils/verifyToken');

class UserAPI extends DataSource {
  initialize(config) {
    this.token = config.context.token;
  }
  
  async getAllUsers() {
    const users = User.find();

    return users;
  }

  async getUser(id) {
    const user = User.findById(id).populate('posts');

    return user;
  }
}

module.exports = UserAPI;
