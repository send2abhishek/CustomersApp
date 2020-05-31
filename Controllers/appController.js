const userSchema = require("../Models/authModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const getExistingUser = await queryUserFromDb(req.body.email);

    if (getExistingUser.length >= 1) {
      return res.status(409).json({
        message: config.get("userExits"),
      });
    } else {
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const user = new userSchema({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            password: hash,
            email: req.body.email,
            country: req.body.country,
            phone: req.body.phone,
          });

          user
            .save()
            .then((result) => {
              res.status(201).json({
                message: config.get("userRegister"),
              });
            })
            .catch((error) => {
              res.status(500).json({
                message: config.get("error"),
                info: error.message,
              });
            });
        }
      });
    }
  } catch (ex) {
    next(ex);
  }
};

const login = async (req, res, next) => {
  try {
    const getExistingUser = await queryUserFromDb(req.body.email);

    if (getExistingUser.length < 1) {
      return res.status(401).json({
        message: config.get("userNotFound"),
      });
    } else {
      bcrypt.compare(
        req.body.password,
        getExistingUser[0].password,
        async (error, resp) => {
          if (error) {
            return res.status(401).json({
              message: config.get("InvalidPassword"),
            });
          }

          if (resp) {
            const Token = jwt.sign(
              {
                username: getExistingUser[0].name,
                email: getExistingUser[0].email,
                country: getExistingUser[0].country,
                city: getExistingUser[0].city,
              },
              config.get("AuthKey"),
              {
                expiresIn: "1h",
              }
            );
            const updateTime = await updateLoginTime(getExistingUser[0]._id);
            return res.status(200).json({
              userId: getExistingUser[0]._id,
              username: getExistingUser[0].name,
              email: getExistingUser[0].email,
              city: getExistingUser[0].city,
              country: getExistingUser[0].country,
              phone: getExistingUser[0].phone,
              loginTime: updateTime.lastLogin,
              token: Token,
            });
          }

          return res.status(401).json({
            message: config.get("InvalidAuth"),
          });
        }
      );
    }
  } catch (err) {
    next(err);
  }
};
const updateLoginTime = async (userId) => {
  try {
    const updateDocument = await userSchema.findByIdAndUpdate(
      userId,
      {
        $set: {
          lastLogin: new Date(),
        },
      },
      { new: true }
    );

    return updateDocument;
  } catch (ex) {
    return new Error(config.get("error"));
  }
};
const queryUserFromDb = async (user) => {
  try {
    const getUser = await userSchema.find({ email: user });
    return getUser;
  } catch (ex) {
    return new Error(config.get("error"));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    let getUsers = await userSchema.find({}, { password: 0, __v: 0 });
    return res.status(200).json(getUsers);
  } catch (ex) {
    next(ex);
  }
};

const uploadFile = async (req, res, next) => {
  try {
    const updateDocument = await userSchema.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          avatar: `${req.headers.host}/uploads/${req.file.originalname}`,
        },
      },
      { new: true }
    );
    if (updateDocument != null || updateDocument != undefined) {
      return res.status(201).json({
        msg: config.get("fileUpload"),
        user: updateDocument,
        userId: req.body.userId,
        fileName: req.file.originalname,
        path: `${req.headers.host}/uploads/${req.file.originalname}`,
      });
    }
    return res.status(201).json({
      message: config.get("error"),
    });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res) => {
  try {
    const updateDocument = await userSchema.findByIdAndUpdate(
      req.body.Id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          country: req.body.country,
          phone: req.body.phone,
          modifiedBy: req.body.Id,
        },
      },
      { new: true }
    );

    res.status(200).json(updateDocument);
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const deletedDocument = await userSchema.findByIdAndRemove(req.body.Id);

    res.status(200).json(deletedDocument);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  fileUpload: uploadFile,
  userLogin: login,
  userRegister: register,
  getAllUsers,
  deletePost,
  updatePost,
};
