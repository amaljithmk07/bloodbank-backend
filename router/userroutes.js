const express = require("express");
const userroutes = express.Router();
const multer = require("multer");
const userDB = require("../models/userschema");
const checkauth = require("../middle-ware/Checkauth");
const bloodbankDB = require("../models/bloodbankschema");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../front-end/public/upload/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//add

userroutes.post("/add", upload.single("image"), checkauth,async (req, res) => {
  try {
    console.log(req.body);
    const Data = new userDB({
      login_id: req.userData.userId,
      image: req.file.filename,
      name: req.body.name,
      date_of_birth: req.body.date_of_birth,
      blood_group: req.body.blood_group,
      booking_date: req.body.booking_date,
      phone_number: req.body.phone_number,
      gender: req.body.gender,
      address: req.body.address,
    });
    Data.save();
    const blood = new bloodbankDB({
      blood_group: req.body.blood_group,
    });
    blood
      .save()

      .then((data) => {
        res.status(200).json({
          success: true,
          error: false,
          data: data,
          message: "Successful",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: true,
          errormessage: err.message,
          message: "failed",
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: true,
      errormessage: err.message,
      message: "Network error",
    });
  }
});

//delete one

userroutes.get("/delete/:id", async(req, res) => {
 await userDB
    .deleteOne({
      _id: req.params.id,
    })
    .then((data) => {
      res.status(200).json({
        success: true,
        error: false,
        data: data,
        message: "Successful",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        error: true,
        errormessage: err.message,
        message: "failed",
      });
    });
});

// display Status booking Approved and Date Provided

userroutes.get("/view", checkauth, async (req, res) => {
  try {
    await userDB
      .find({
        login_id: req.userData.userId,
        // status: "approved",
      })
      .then((data) => {
        res.status(200).json({
          success: true,
          error: false,
          data: data,
          message: "successful",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: true,
          data: "failed",
          ErrorMessage: err.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: true,
      data: "Internal server Error",
      ErrorMessage: err.message,
    });
  }
});

// User Blood Donated History

userroutes.get("/booking-history", checkauth, async (req, res) => {
  try {
    await userDB
      .find({
        login_id: req.userData.userId,
        status: "donated",
      })
      .then((data) => {
        res.status(200).json({
          success: true,
          error: false,
          data: data,
          message: "successful",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: true,
          data: "failed",
          ErrorMessage: err.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: true,
      data: "Internal server Error",
      ErrorMessage: err.message,
    });
  }
});

module.exports = userroutes;
