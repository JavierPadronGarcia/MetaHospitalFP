const jwt = require('jsonwebtoken');
const utils = require("../utils");
const bcrypt = require('bcryptjs');

const db = require("../models");
const User = db.userAccounts;

exports.signin = (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;

  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  User.findOne({ where: { username: user } }).then(data => {
    const result = bcrypt.compareSync(pwd, data.password);
    if (!result) return res.status(401).send('Password not valid!');

    const token = utils.generateToken(data);

    const userObj = utils.getCleanUser(data);
    return res.json({ user: userObj, access_token: token })
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    })
  })
}

exports.codeSignin = (req, res) => {
  const code = req.body.username;

  if (!code) {
    return res.status(400).json({
      error: true,
      message: "Code required."
    });
  }

  User.findOne({ where: { code: code } }).then(user => {
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }
    const token = utils.generateToken(user);
    const userObj = utils.getCleanUser(user);
    return res.json({ user: userObj, access_token: token })
  })
}

exports.isAuthenticated = (req, res, next) => {
  var token = req.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required."
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: 'Invalid token.'
    })

    User.findByPk(user.id).then(data => {
      if (!data) {
        return res.status(401).json({
          error: true,
          message: "Invalid user."
        });
      }
      next();
    }).catch(err => {
      res.status(500).send({
        error: true,
        message:
          err.message || "Some error occurred while retrieving users."
      })
    })
  })
}

exports.getRole = (req, res) => {
  if (req.user) {
    return res.json({ role: req.user.role })
  }
  return res.status(404).json({
    error: true,
    message: "User not found"
  })
}
