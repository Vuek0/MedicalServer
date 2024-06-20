const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitSchema = new Schema(
  {
    doctor: {
        type: String,
        required: true,
    },
    pacient: {
        type: String,
        required: true,
    },
    diagnos: {
        type: String,
        required: true,
    },
    result: {
        type: String,
        required: true,
    },
    referral: {
        type: Array,
        required: true,
    },
  }
);

const Visit = mongoose.model('Visit', visitSchema)
module.exports = Visit