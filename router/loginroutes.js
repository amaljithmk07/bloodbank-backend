const express = require("express");
const loginroutes = express.Router();
const loginDB = require("../models/loginschema");
const registerDB = require("../models/registerschema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

loginroutes.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const loweremail = email.toLowerCase();
    console.log(loweremail);
    if (loweremail && req.body.password) {
      const olduser = await loginDB.findOne({
        email: loweremail,
      });

      if (!olduser) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Email is invalid ",
        });
      }
      const passwordmatch = await bcrypt.compare(
        req.body.password,
        olduser.password
      );
      //   console.log('passwordmatch',passwordmatch);
      if (!passwordmatch) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "The password does not match.",
        });
      }
      const token = await jwt.sign(
        {
          userId: olduser._id,
          userRole: olduser.role,
          userEmail: olduser.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        success: true,
        error: false,
        message: "Login Successful",
        token: token,
        userId: olduser._id,
        userRole: olduser.role,
        userEmail: olduser.email,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "All fields are required",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Login failed",
      Errormessage: err.message,
    });
  }
});

module.exports = loginroutes;
