const db = require("../../models");
const User = db.userAccounts;
const Role = db.role;
const Admin = db.admin;
const Student = db.student;
const Teacher = db.teacher;
const UserRole = db.userRole;
const Op = db.Sequelize.Op;
const utils = require("../../utils");
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path')
const teacherController = require('./teacher.controller');
const studentController = require('./student.controller');
const adminController = require('./admin.controller');

//Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password || !req.body.role || !req.body.name) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let user = {
    username: req.body.username,
    password: req.body.password,
  }

  const data = await User.findOne({ where: { username: user.username } });

  // USER ALREADY EXISTS
  if (data) {
    return res.status(404).send({
      error: true,
      message: 'The user already exists'
    });
  }

  user.password = bcrypt.hashSync(req.body.password);

  const createdUser = await User.create(user);

  const role = await Role.findOne({ where: { name: req.body.role } });

  if (role) {
    const userRole = {
      UserID: createdUser.id,
      AppID: 1,
      RoleID: role.id
    }
    await UserRole.create(userRole);

    const userObj = utils.getCleanUser(createdUser);
    userObj.role = role.name;

    req.body.userId = userObj.id;
    console.log(userObj.role)

    switch (userObj.role) {
      case 'admin':
        await adminController.create(req, res);
        break;
      case 'teacher':
        await teacherController.create(req, res);
        break;
      case 'student':
        await studentController.create(req, res);
        break;
    }
  } else {
    return res.status(404).send({
      error: true,
      mesasge: 'The role was not found'
    });
  }
}

// exports.findAllDirectors = (req, res) => {
//   User.findAll({ where: { role: 'director' } }).then(allDirectors => {
//     return res.send(allDirectors);
//   }).catch(err => {
//     return res.status(500).send({
//       message:
//         err.message || "Error retrieving all directors"
//     });
//   })
// }

exports.findByRole = (req, res) => {
  req.send(req.user.role);
}

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Admin },
        { model: Student },
        { model: Teacher }
      ]
    });

    const formattedUsers = users.map(user => {
      let userData = user.toJSON();
      if (user.Admin) {
        userData.name = user.Admin.name;
        userData.role = 'admin';
      } else if (user.Student) {
        userData.name = user.Student.name;
        userData.role = 'student';
      } else if (user.Teacher) {
        userData.name = user.Teacher.name;
        userData.role = 'teacher';
      }
      return userData;
    });

    return res.send(formattedUsers);
  } catch (err) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    })
  }
}

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: "Error retrieving User with id=" + id
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id;
  if (!req.body.newUsername) {
    return res.status(400).send({
      error: true,
      message: 'Content cannot be empty'
    });
  }

  User.findOne({ where: { id: id } }).then(data => {
    const user = {
      username: req.body.username || data.username,
      password: data.password,
      code: data.code,
      codeExpirationDate: data.codeExpirationDate,
      filename: data.filename
    }

    User.update(user, { where: { id: id } }).then(response => {
      return res.send({
        error: true,
        message: 'User updated successfully'
      });
    });
  });
}

async function generateUUID() {
  let uuid = "";
  let goodUUID = false;
  const actualDate = new Date();
  let count = 0;

  do {
    goodUUID = false;
    uuid = Math.random().toString(36).slice(9).replace(' ', '');
    if (uuid.length === 4) {
      const user = await User.findAll({
        where: {
          code: uuid,
          codeExpirationDate: { [Op.gt]: actualDate }
        }
      });
      if (user.length == 0) {
        goodUUID = true;
      } else {
        count++;
      }
    }
  } while (goodUUID == false && count < 1000);
  if (count >= 1000) {
    throw new Error({ message: "could not find available code" });
  }
  return uuid
}

exports.assignCode = async (req, res) => {
  let uuid = "";
  const expDate = req.body.expDate;
  const userId = req.user.id;
  try {
    uuid = await generateUUID();
  } catch (err) {
    return res.status(404).send({ err });
  }
  User.findOne({ where: { id: userId } }).then(user => {
    user.code = uuid;
    user.codeExpirationDate = expDate;
    user.save();
    return res.send({ code: uuid });
  }).catch(err => {
    return res.status(500).send({
      error: err.message || "Error retrieving the user"
    });
  })
}

exports.unAssignCode = async (req, res) => {
  const userId = req.user.id;
  User.findOne({ where: { id: userId } }).then(user => {
    user.code = null;
    user.codeExpirationDate = null;
    user.save();
    return res.send({ message: "expDate and code eliminated" });
  }).catch(err => {
    return res.status(500).send({
      error: err.message || "Error unAssignnin the code"
    })
  })
}

// exports.assignDirector = (req, res) => {
//   const newDirector = req.params.id;
//   const previousDirector = req.body.directorId;

//   if (previousDirector) {
//     User.findByPk(previousDirector).then(prevDirector => {
//       prevDirector.isDirector = false;
//       prevDirector.save();
//       updateNewDirector(newDirector, res);
//     }).catch(err => {
//       return res.status(500).send({
//         message: err.message || "Could not find the user to update"
//       });
//     })
//   } else {
//     updateNewDirector(newDirector, res);
//   }
// }

// const updateNewDirector = (newDirector, res) => {
//   User.findByPk(newDirector).then(director => {
//     let newDirector = {
//       id: director.id,
//       username: director.username,
//       password: director.password,
//       role: director.role,
//       isDirector: true,
//       filename: director.filename,
//       createdAt: director.createdAt,
//       updatedAt: director.updatedAt
//     }

//     User.update(newDirector, { where: { id: director.id } }).then(response => {
//       console.log(response)
//       return res.send(director);
//     }).catch(err => {
//       return res.status(500).send({
//         message: err.message || "Cannot update the new director"
//       });
//     })
//   }).catch(err => {
//     return res.status(500).send({
//       message: err.message || "Cannot find the new director"
//     });
//   })
// }

exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByPk(id).then(user => {
    if (user.filename != '') {
      const imagePath = path.join(__dirname, '../public/images', user.filename);
      fs.unlink(imagePath, err => {
        if (err) {
          return res.status(500).send({ message: "There was an error deleting the image" })
        }
      })
    }
  }).catch(err => {
    return res.status(500).send({
      message: err.message || "Could not find the user to delete"
    });
  })

  User.destroy({ where: { id: id } }).then(num => {
    if (num === 1) {
      return res.send({
        message: "User was deleted successfully!"
      })
    }
    return res.send({
      message: `Cannot delete User with id=${id}. Maybe User was not found!`
    })

  }).catch(err => {
    return res.status(500).send({
      message: "Could not delete User with id=" + id
    })
  })
}

// User.findByPk(id).then(user => {
//   if (user.filename != '') {
//     const imagePath = path.join(__dirname, '../public/images', user.filename);
//     fs.unlink(imagePath, err => {
//       if (err) {
//         return res.status(500).send({ message: "There was an error deleting the image" })
//       }
//     })
//   }
// }).catch(err => {
//   return res.status(500).send({
//     message: err.message || "Could not find the user to delete"
//   });
// })

exports.updateWithImage = (req, res) => {
  const userDecoded = utils.decodeToken(req.headers['authorization']);
  const previousImage = req.body.previousImage;
  const newUsername = req.body.newUsername;

  const updatedUser = {
    id: userDecoded.id,
    username: newUsername || userDecoded.username,
    password: userDecoded.password,
    role: userDecoded.role,
    filename: req.file ? req.file.filename : null
  }

  if (previousImage !== '') {
    const previousImagePath = path.join(__dirname, '../public/images', previousImage);

    fs.unlink(previousImagePath, err => {
      if (err) {
        return res.status(500).send({ message: "There was an error deleting the previous image" })
      }
    })
  }

  User.update(updatedUser, { where: { id: updatedUser.id } }).then(num => {
    if (num == 1) {
      return res.send({
        message: "User was updated successfully."
      })
    }
    return res.status(500).send({
      message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
    })
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Error updating User with id=" + id
    });
  })
}