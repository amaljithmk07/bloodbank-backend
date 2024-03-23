const mongoose = require("mongoose");
const loginschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: Number,
    required: true,
  },
});

const login = mongoose.model("login_db", loginschema);
module.exports = login;
