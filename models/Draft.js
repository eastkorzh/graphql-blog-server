const mongoose = require('mongoose');

const DraftSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  cover: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  content: {
    type: String,
    required: false,
  },
  originalPost: {
    type: String,
    required: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { _id: false });

module.exports = mongoose.model('Draft', DraftSchema);
