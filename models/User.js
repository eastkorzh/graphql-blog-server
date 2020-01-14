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
  date: {
    type: Date,
    default: Date.now,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }]
})

userSchema.methods.createPost = function() {
  console.log(this);
}

module.exports = mongoose.model('User', userSchema);
