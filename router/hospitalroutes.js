const express = require("express");
const hospitalroutes = express.Router();
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

//view

hospitalroutes.get("/view", checkauth, async (req, res) => {
  try {
    await userDB
      .find({
        status: "pending",
      })
      .then((data) => {
        res.status(200).json({
          success: true,
          error: false,
          data: data,
          message: "Booked Session view successful",
        });

        // res.send(data)
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: true,
          data: "Booked Session view failed",
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

// Booking Approved History

hospitalroutes.get("/booking-approved-history", checkauth, async (req, res) => {
  try {
    // Find documents with status: "approved"
    const data = await userDB.find({ status: "booking_approved" });

    return res.status(200).json({
      success: true,
      error: false,
      data: data,
      message: "Booked Session view successful",
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

//view One

hospitalroutes.get("/viewone/:id", checkauth, async (req, res) => {
  try {
    await userDB
      .find({
        _id: req.params.id,
      })

      .then((data) => {
        console.log(data);
        res.status(200).json({
          success: true,
          error: false,
          data: data,
          message: "single view successful",
        });
        // res.send(data)
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: true,
          data: "single view failed",
          ErrorMessage: err.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: true,
      data: " failed",
      ErrorMessage: err.message,
    });
  }
});

//Approve Booking Donation Request

hospitalroutes.get("/approve-booking/:id", checkauth, async (req, res) => {
  try {
    await userDB
      .updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            status: "booking_approved",
          },
        }
      )
      .then((data) => {
        res.status(200).json({
          success: true,
          error: false,
          data: data,
          message: "Approved successful",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: true,
          data: "Approved failed",
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

//Cancel Donation Request

hospitalroutes.get("/cancel/:id", checkauth, async (req, res) => {
  try {
    await userDB
      .updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            status: "pending",
          },
        }
      )
      .then((data) => {
        res.status(200).json({
          success: true,
          error: false,
          data: data,
          message: "Cancel successful",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: true,
          data: "Cancel failed",
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

//approve Donation Date

hospitalroutes.put("/approve-date/:id", checkauth, async (req, res) => {
  try {
    var user = await userDB.findOne({
      _id: req.params.id,
    });

    const newdata = {
      name: req.body.name ? req.body.name : user.name,
      blood_group: req.body.blood_group
        ? req.body.blood_group
        : user.blood_group,
      gender: req.body.gender ? req.body.gender : user.gender,
      date_of_birth: req.body.date_of_birth
        ? req.body.date_of_birth
        : user.date_of_birth,
      phone_number: req.body.phone_number
        ? req.body.phone_number
        : user.phone_number,
      address: req.body.address ? req.body.address : user.address,
      status: req.body.status ? req.body.status : user.status,
      donation_date: req.body.donation_date ? req.body.donation_date : null,
    };
    console.log("newdata", newdata);
    const dateApproved = await userDB.updateMany(
      {
        _id: req.params.id,
      },
      {
        $set: newdata,
      }
    );

    if (dateApproved) {
      return res.status(200).json({
        success: true,
        error: false,
        data: dateApproved,
        message: "Cancel successful",
      });
    } else
      (err) => {
        return res.status(400).json({
          success: false,
          error: true,
          data: "Cancel failed",
          ErrorMessage: err.message,
        });
      };
  } catch (err) {
    res.status(500).json({
      success: false,
      error: true,
      data: "Internal server Error",
      ErrorMessage: err.message,
    });
  }
});

//Donation Complete

hospitalroutes.put("/donation-complete/:id", checkauth, async (req, res) => {
  try {
    var user = await userDB.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          status: "donated",
        },
      }
    );
    console.log(user);
    var blooduser = await userDB.findOne({
      _id: req.params.id,
    });
    // console.log(blooduser.blood_group);
    const bloodbank = {
      login_id: blooduser._id,
      blood_group: blooduser.blood_group,
    };
    await bloodbankDB(bloodbank).save();
    if (bloodbank) {
      return res.status(200).json({
        success: true,
        error: false,
        data: bloodbank,
        message: "Donated Successful ",
      });
    } else
      (err) => {
        return res.status(400).json({
          success: false,
          error: true,
          data: "Donated failed",
          ErrorMessage: err.message,
        });
      };
  } catch (err) {
    res.status(500).json({
      success: false,
      error: true,
      data: "Internal server Error",
      ErrorMessage: err.message,
    });
  }
});

//Donor History

hospitalroutes.get("/donor-history", checkauth, async (req, res) => {
  try {
    var user = await userDB
      .find({
        status: "donated",
      })
      .then((data) => {
        res.status(200).json({
          success: true,
          error: false,
          data: data,
          message: "Donated Successful ",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: true,
          data: "Donated failed",
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

//Blood Bank Available quantity

hospitalroutes.get("/blood-bank", checkauth, async (req, res) => {
  try {
    const bloodGroup = [
      "A_positive",
      "A_negative",
      "B_positive",
      "B_negative",
      "O_positive",
      "O_negative",
      "AB_positive",
      "AB_negative",
    ];

    for (const i of bloodGroup) {
      var count = await bloodbankDB.countDocuments({
        blood_group: i,
      });
      // console.log(`Count of documents with field value ${i}: ${count}`);
      var blood = { ...blood, [i]: count };
    }
    // console.log("blood", blood);
    return res.status(200).json({
      success: true,
      error: false,
      data: blood,

      message: "Display successful",
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

//Seperate Blood List

hospitalroutes.get("/blood-list/:blood", checkauth, async (req, res) => {
  try {
    // await bloodbankDB
    //   .find({
    //     blood_group: req.params.blood,
    //   })
    const Data = await bloodbankDB.aggregate([
      [
        {
          $lookup: {
            from: "user_details",
            localField: "login_id",
            foreignField: "_id",
            as: "results",
          },
        },
        {
          $unwind: {
            path: "$results",
          },
        },
        {
          $match: {
            blood_group: req.params.blood,
          },
        },
        {
          $group: {
            _id: "$_id",
            name: {
              $first: "$results.name",
            },
            gender: {
              $first: "$results.gender",
            },
            blood_group: {
              $first: "$results.blood_group",
            },
            donation_date: {
              $first: "$results.donation_date",
            },
            phone_number: {
              $first: "$results.phone_number",
            },
            address: {
              $first: "$results.address",
            },
          },
        },
      ],
    ]);
    console.log(Data);
    if (Data) {
      // console.log(Data);
      res.status(200).json({
        success: true,
        error: false,
        data: Data,
        message: "single view successful",
      });
      // res.send(data)
    } else
      (err) => {
        res.status(400).json({
          success: false,
          error: true,
          data: "single view failed",
          ErrorMessage: err.message,
        });
      };
  } catch (err) {
    res.status(500).json({
      success: false,
      error: true,
      data: " failed",
      ErrorMessage: err.message,
    });
  }
});

module.exports = hospitalroutes;
