const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "login_db",
    required: true,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  blood_group: {
    type: String,
    required: true,
  },
  booking_date: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    required: true,
  },
  donation_date: {
    type: String,
    require: true,
  },
});

const data = mongoose.model("User_Details", userschema);
module.exports = data;
