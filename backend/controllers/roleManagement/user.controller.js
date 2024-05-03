const db = require("../../models");
const User = db.userAccounts;
const Role = db.role;
const Admin = db.admin;
const Student = db.student;
const Teacher = db.teacher;
const UserRole = db.userRole;
const School = db.school;
const StudentSchool = db.studentSchool;
const TeacherSchool = db.teacherSchool;
const Op = db.Sequelize.Op;
const utils = require("../../utils");
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const teacherController = require('./teacher.controller');
const studentController = require('./student.controller');
const adminController = require('./admin.controller');
const enviarCorreo = require('../mail/mail.controller');
const TeacherToSchool = require("../administration/teacherschool.controller");
const StudentToSchool = require('../administration/studentschool.controller')

exports.create = async (req, res) => {

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

  if (data) {
    return res.status(500).send({
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

    enviarCorreo(user.username, 'Se le Ha dado de alta en MetaHospitalFP');

  } else {
    return res.status(500).send({
      error: true,
      mesasge: 'The role was not found'
    });
  }
}

exports.findByRole = (req, res) => {
  req.send(req.user.role);
}

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      },
      include: [{ model: Admin }, { model: Student }, { model: Teacher }],
    });

    const formattedUsersPromises = users.map(async (user) => {
      let userData = user.toJSON();
      if (user.Admin) {
        await School.findByPk(user.Admin.schoolId).then((data) => {
          if (data == null) {
            userData.schoolName = "";
            userData.schoolId = null;
          } else {
            userData.schoolName = data.name;
            userData.schoolId = data.id;
          }
        });
        userData.name = user.Admin.name;
        userData.role = "admin";
      } else if (user.Student) {
        const studentSchool = await StudentSchool.findOne({
          where: {
            StudentID: user.id,
          },
        });

        if (!studentSchool) {
          userData.schoolName = "";
          userData.schoolId = null;
        } else {
          const school = await School.findByPk(studentSchool.SchoolID);
          userData.schoolName = school.name;
          userData.schoolId = school.id;
        }

        userData.name = user.Student.name;
        userData.role = "student";
      } else if (user.Teacher) {
        const teacherSchool = await TeacherSchool.findOne({
          where: {
            TeacherID: user.id,
          },
        });

        if (!teacherSchool) {
          userData.schoolName = "";
          userData.schoolId = null;
        } else {
          const school = await School.findByPk(teacherSchool.SchoolID);
          userData.schoolName = school.name;
          userData.schoolId = school.id;
        }

        userData.name = user.Teacher.name;
        userData.role = "teacher";
      }
      return userData;
    });
    const formattedUsers = await Promise.all(formattedUsersPromises);
    return res.send(formattedUsers);
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id, {
    include: [
      { model: Student },
      { model: Admin },
      { model: Teacher }
    ]
  }).then(data => {
    const user = data.toJSON();
    let name = null;

    if (user.Teacher && user.Teacher.name) {
      name = user.Teacher.name;
    } else if (user.Admin && user.Admin.name) {
      name = user.Admin.name;
    } else if (user.Student && user.Student.name) {
      name = user.Student.name;
    }

    user.name = name;
    res.send(user);
  }).catch(err => {
    res.status(500).send({
      message: "Error retrieving User with id=" + id
    })
  })
}

exports.update = async (req, res) => {

  const id = req.params.id;
  if (!req.body.username && !req.body.name && !req.body.role) {
    return res.status(400).send({
      error: true,
      message: 'Content cannot be empty'
    });
  }

  const userFound = await User.findOne({
    where: {
      id: id
    },
    include: [
      { model: Admin },
      { model: Teacher },
      { model: Student },
    ]
  });

  const actualUserRole = await UserRole.findOne({
    where: {
      UserID: userFound.id,
      AppID: 1
    },
    include: [{ model: Role }]
  })


  if (actualUserRole.Role.name !== req.body.role && req.body.role !== '') {
    const newRole = await Role.findOne({
      where: {
        name: req.body.role
      }
    })
    let oldRoleName = actualUserRole.Role.name;
    let oldUserInTableRole = null;

    oldUserInTableRole = await deleteUserInTableRole(oldRoleName, oldUserInTableRole);

    if (req.body.name !== '') {
      oldUserInTableRole.name = req.body.name;
      req.body.name = '';
    }

    await UserRole.update(
      {
        RoleID: newRole.id,
      },
      {
        where: {
          UserID: userFound.id,
          RoleID: actualUserRole.RoleID,
          AppID: 1
        }
      });
    await createUserInTableRole(newRole.name, oldUserInTableRole);
  }

  if (req.body.name !== '') {
    switch (actualUserRole.Role.name) {
      case 'admin':
        const adminUser = await Admin.findOne({ where: { id: userFound.id } });
        adminUser.name = req.body.name;
        await adminUser.save();
        break;
      case 'teacher':
        const teacherUser = await Teacher.findOne({ where: { id: userFound.id } });
        teacherUser.name = req.body.name;
        await teacherUser.save();
        break;
      case 'student':
        const studentUser = await Student.findOne({ where: { id: userFound.id } });
        studentUser.name = req.body.name;
        await studentUser.save();
        break;
    }
  }

  if (req.body.username !== '') {
    userFound.username = req.body.username;
    await userFound.save();
  }

  if (req.body.schoolId !== null) {
    switch (actualUserRole.Role.name) {
      case 'admin':
        const adminUser = await Admin.findOne({ where: { id: userFound.id } });
        if (adminUser) {
          adminUser.SchoolID = req.body.schoolId;
          await adminUser.save();
        }
        break;
      case 'teacher':
        await TeacherToSchool.updateTeacherSchoolById(userFound.id, req.body.schoolId);
        break;
      case 'student':
        await StudentToSchool.updateStudentSchoolById(userFound.id, req.body.schoolId);
        break;
    }
  }

  return res.send();

  async function deleteUserInTableRole(oldRoleName, oldUserInTableRole) {
    switch (oldRoleName) {
      case 'admin':
        oldUserInTableRole = userFound.Admin;
        await Admin.destroy({
          where: { id: actualUserRole.UserID }
        })
        break;
      case 'teacher':
        oldUserInTableRole = userFound.Teacher;
        await Teacher.destroy({
          where: { id: actualUserRole.UserID }
        })
        break;
      case 'student':
        oldUserInTableRole = userFound.Student;
        await Student.destroy({
          where: { id: actualUserRole.UserID }
        })
        break;
    }
    return oldUserInTableRole
  }

  async function createUserInTableRole(newRoleName, oldUserInTableRole) {
    switch (newRoleName) {
      case 'admin':
        await Admin.create({
          id: oldUserInTableRole.id,
          name: oldUserInTableRole.name,
          age: oldUserInTableRole.age,
          SchoolID: req.body.schoolId
        })
        break;
      case 'teacher':
        await Teacher.create({
          id: oldUserInTableRole.id,
          name: oldUserInTableRole.name,
          age: oldUserInTableRole.age,
        })
        TeacherToSchool.updateTeacherSchoolById(oldUserInTableRole.id, req.body.schoolId);
        break;
      case 'student':
        await Student.create({
          id: oldUserInTableRole.id,
          name: oldUserInTableRole.name,
          age: oldUserInTableRole.age,
        })
        StudentToSchool.updateStudentSchoolById(oldUserInTableRole.id, req.body.schoolId);
        break;
    }
  }
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
  console.log(expDate)
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

exports.internalAssignCode = async (userId, expDate) => {
  let uuid = "";
  try {
    uuid = await generateUUID();
  } catch (err) {
    return res.status(404).send({ err });
  }
  console.log(userId)
  User.findOne({ where: { id: userId } }).then(user => {
    user.code = uuid;
    user.codeExpirationDate = expDate;
    user.save();
    return { code: uuid };
  }).catch(err => {
    console.log(err.message)
    return;
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

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);

    if (user.filename !== '' && user.filename != null) {
      const imagePath = path.join(__dirname, '../public/images', user.filename);
      fs.unlink(imagePath, err => {
        if (err) {
          return res.status(500).send({ message: "There was an error deleting the image" })
        }
      })
    }

    await user.destroy();

    return res.send({ message: "User deleted successfuly" });

  } catch (error) {
    return res.status(500).send({ error: true, message: `Error deleting the user: ${error.message}` });
  }

}

exports.updateWithImage = (req, res) => {
  const userDecoded = req.user;
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
    const previousImagePath = path.join(__dirname, '../../public/images', previousImage);
    fs.unlinkSync(previousImagePath, err => {
      if (err) {
        return res.status(500).send({ message: "There was an error deleting the previous image" });
      }
    });
  }
  updateUser(res, updatedUser);
}

function updateUser(res, updatedUser) {
  User.update(updatedUser, { where: { id: updatedUser.id } }).then(num => {
    if (num == 1) {
      return res.send({
        message: "User was updated successfully."
      });
    } else {
      return res.status(500).send({
        message: `Cannot update User with id=${updatedUser.id}. Maybe User was not found or req.body is empty!`
      });
    }
  }).catch(error => {
    return res.status(500).send({ message: error.message || "Some error occurred while updating the User." });
  });
}

exports.getUserById = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [
        { model: Teacher },
        { model: Student },
      ]
    });

    user.toJSON();

    if (user.Teacher) {
      user.name = user.Teacher.name;
    } else if (user.Student) {
      user.name = user.Student.name;
    }

    return user;
  } catch (err) {
    throw err;
  }
}