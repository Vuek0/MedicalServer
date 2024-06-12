const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
  }
);

const Post = mongoose.model('Post', postSchema)
module.exports = Post