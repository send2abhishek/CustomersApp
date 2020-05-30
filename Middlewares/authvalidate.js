const jwt = require("jsonwebtoken");
const config = require("config");
const AuthCheck = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decode = jwt.verify(token, config.get("AuthKey"));
    req.userData = decode;

    next();
  } catch (error) {
    return res.status(401).json({
      errorMsg: config.get("InvalidToken"),
      error: error,
    });
  }
};

module.exports = AuthCheck;
