const mongoose = require("mongoose");

const bloodbankschema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User_Details",
  },

  blood_group: {
    type: String,
    required: true,
  },
});
var Data = mongoose.model("Blood_bank", bloodbankschema);
module.exports = Data;
