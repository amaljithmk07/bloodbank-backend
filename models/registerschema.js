const mongoose = require("mongoose");
const registerschema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "login_db",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
});
const register = mongoose.model("register_db", registerschema);
module.exports = register;
