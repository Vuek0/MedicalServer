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
    diagnose: {
        type: String,
        required: true,
    },
    treatment: {
        type: String,
        required: true,
    },
    result: {
        type: String,
        required: true,
    },
    status: {
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