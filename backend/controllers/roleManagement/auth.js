const jwt = require('jsonwebtoken');
const utils = require("../../utils");
const bcrypt = require('bcryptjs');

const db = require("../../models");
const User = db.userAccounts;
const UserRole = db.userRole;
const Admin = db.admin;
const School = db.school;
const Role = db.role;
const TokenJWT = db.tokenJWT;

exports.signin = (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;

  if (!user || !pwd) {
    return res.status(401).json({
      error: true,
      message: "Username or Password required."
    });
  }

  User.findOne({ where: { username: user } }).then(data => {
    const result = bcrypt.compareSync(pwd, data.password);
    if (!result) return res.status(401).send('Password not valid!');

    getRole(data).then(async (role) => {
      const userObj = utils.getCleanUser(data);
      userObj.role = role.name;

      if (userObj.role === 'admin') {
        const adminData = await Admin.findByPk(userObj.id, { include: [{ model: School }] });
        userObj.schoolId = adminData.SchoolID;
        userObj.school = adminData.School;
      }

      getToken(userObj).then(token => {
        return res.json({ user: userObj, access_token: token })
      }).catch(err => {
        res.status(500).send({
          error: true,
          message: 'Error creating a new token for the user, details: ' + err.message
        })
      });

    }).catch(err => {
      return res.status(500).send({
        error: true,
        message: 'Error getting the role of the user, details: ' + err.message
      })
    });
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
      return res.status(401).json({
        error: true,
        message: "User not found"
      });
    }

    getRole(user).then(role => {
      const userObj = utils.getCleanUser(user);
      userObj.role = role.name;

      getToken(userObj).then(token => {
        return res.json({ user: userObj, access_token: token })
      }).catch(err => {
        res.status(500).send({
          error: true,
          message: 'Error creating a new token for the user, details: ' + err.message
        })
      });

    }).catch(err => {
      return res.status(500).send({
        error: true,
        message: 'Error getting the role of the user, details: ' + err.message
      })
    })
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
  return res.status(204).json({
    error: true,
    message: "User not found"
  })
}


async function getRole(user) {
  const response = await Role.findOne({
    include: {
      model: UserRole,
      where: {
        UserID: user.id
      }
    }
  })
  return response;
}

async function getToken(user) {
  try {
    let tokenInfo = await TokenJWT.findOne({ where: { UserID: user.id } });

    if (!tokenInfo) { // no token found
      tokenInfo = utils.generateToken(user);
      await TokenJWT.create({
        UserID: user.id,
        token: tokenInfo.token,
        expireDate: tokenInfo.expireDate
      });
    } else if (tokenInfo.expireDate < Date.now()  //token expired or expires in less than two hours
      || (tokenInfo.expireDate - Date.now() < 2 * 60 * 60 * 1000)) {
      const tokenId = tokenInfo.id;
      tokenInfo = utils.generateToken(user);

      await TokenJWT.update({
        UserID: user.id,
        token: tokenInfo.token,
        expireDate: tokenInfo.expireDate
      }, {
        where: { id: tokenId }
      });
    }

    return tokenInfo.token;
  } catch (err) {
    throw err;
  }
}

exports.changePassword = (req, res) => {
  try {
    const { id } = req.user;

    const password = bcrypt.hashSync(req.body.password);

    User.update({ password: password }, { where: { id } })
      .then(() => {
        res.status(200).send("User password has been updated.");
      })
      .catch((err) => {
        console.log('Error in changePassword', err);
      });
  } catch (err) {
    res.status(500).send({
      error: true,
      message: err.message || "Some error ocurred changing password",
    });
  }
};