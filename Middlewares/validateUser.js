const joi = require("joi");

const validateUserId = (req, res, next) => {
  const schema = joi.object().keys({
    userId: joi.string().required(),
  });
  if (req.file === undefined) {
    return res.status(400).json({
      message: "file is empty",
    });
  }

  joi.validate(req.body, schema, (err, value) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    next();
  });
};

module.exports = validateUserId;
