const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
  pictureName: {
    type: String,
    required: true,
    unique: true
  },
  authorEmail: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true
  },
  like: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: Array,
    default: []
  },
  Comments: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;
