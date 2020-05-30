const joi = require("joi");

const validateReg = (req, res, next) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    password: joi.string().min(4).max(10).required(),
    email: joi.string().email({ minDomainAtoms: 2 }).required(),
    country: joi.string().alphanum().min(2).max(10).required(),
    phone: joi.number().required(),
  });

  joi.validate(req.body, schema, (err, val) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    next();
  });
};

const validateLogin = (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().email({ minDomainAtoms: 2 }).required(),
    password: joi.string().min(4).max(10).required(),
  });

  joi.validate(req.body, schema, (err, value) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    next();
  });
};

module.exports = {
  validateRegistration: validateReg,
  validateUser: validateLogin,
};
