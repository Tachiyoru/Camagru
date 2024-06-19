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
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;
