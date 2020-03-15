const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 4,
    max: 1024,
  },
  avatar: {
    type: String,
    required: false,
    min: 1,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  drafts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draft',
  }],
})

module.exports = mongoose.model('User', userSchema);
