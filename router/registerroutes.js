const express = require("express");
const bcrypt = require("bcryptjs");
const registerDB = require("../models/registerschema");
const loginDB = require("../models/loginschema");
const registerrouter = express.Router();

registerrouter.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const lower_email = email.toLowerCase();
    const oldemail = await loginDB.findOne({
      email: lower_email,
    });

    if (oldemail) {
      return res.status(400).json({
        success: false,
        error: true,
        errormessage: "Email already exist",
      });
    }
    const oldphone = await registerDB.findOne({
      phone_number: req.body.phone_number,
    });
    if (oldphone) {
      return res.status(400).json({
        success: false,
        error: true,
        errormessage: "phone number already exist",
      });
    }

    const comparepassword = req.body.password.localeCompare(
      req.body.confirm_password
    );
    if (comparepassword !== 0) {
      return res.status(400).json({
        success: false,
        error: true,
        errormessage: "Password does not match",
      });
    }
    const hashedpassword = await bcrypt.hash(req.body.password, 12);
    const log = {
      email: lower_email,
      password: hashedpassword,
      role: 2,
    };
    // console.log(log);
    const log_result = await loginDB(log).save();
    const register = {
      login_id: log_result._id,
      name: req.body.name,
      age: req.body.age,
      phone_number: req.body.phone_number,
    };
    const reg_result = await registerDB(register).save();
    if (reg_result) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "register successful",
        data: reg_result,
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "All fields are required",
      errormessage: err.message,
    });
  }
});
module.exports = registerrouter;
