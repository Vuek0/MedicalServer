const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
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
    },
    type: {
      type: String,
      required: true
    },
    _id: {
      type: String,
      required: false
    }
  }
);

const User = mongoose.model('User', userSchema)
module.exports = User