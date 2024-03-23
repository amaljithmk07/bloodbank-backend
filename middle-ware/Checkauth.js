const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "this_Should_be_secret");
    req.userData = {
      userId: decodedToken.userId,
      userEmail: decodedToken.userEmail,
      userRole: decodedToken.userRole,
    };
    console.log("req.userData :", req.userData);
    next();
  } catch (err) {
    res.status(401).json({
      message: "Auth failed!",
      status: 401,
      ErrorMessage: err.message,
    });
  }
};
