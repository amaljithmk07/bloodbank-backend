const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userroutes = require("./router/userroutes");
const registerrouter = require("./router/registerroutes");
const loginroutes = require("./router/loginroutes");
const hospitalroutes = require("./router/hospitalroutes");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Data Base Connected");
  })
  .catch((err) => {
    console.log(err);
  });

server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/login", loginroutes);
server.use("/api/register", registerrouter);
server.use("/api/user", userroutes);
server.use("/api/hospital", hospitalroutes);

const port =process.env.PORT_NUMBER ;
server.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
