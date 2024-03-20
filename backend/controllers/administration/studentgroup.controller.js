const db = require("../../models");
const userController = require('../roleManagement/user.controller');
const UserAccounts = db.userAccounts;
const Student = db.student;
const StudentGroup = db.studentGroup;
const Group = db.groups;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

  const studentId = req.body.UserID;
  const groupId = req.body.GroupID;
  const date = req.body.Date;

  if (!studentId || !groupId || !date) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const studentGroup = {
    StudentID: studentId,
    GroupID: groupId,
    Date: date
  };

  StudentGroup.create(studentGroup).then(async (data) => {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 10);
    await userController.internalAssignCode(data.StudentID, expirationDate);
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      error: true,
      message: err.message || "Some error occurred while creating a groupEnrolement"
    });
  });
};

exports.findAll = (req, res) => {
  StudentGroup.findAll().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Error retrieving groupEnrolements"
    });
  });
};

exports.findAllOrderedByGroupDesc = (req, res) => {
  StudentGroup.findAll({
    attributes: ['id', 'Date', 'createdAt', 'updatedAt'],
    order: [['GroupID', 'DESC']],
    include: [
      {
        model: UserAccounts,
        attributes: ['id', 'username', 'filename', 'createdAt', 'updatedAt']
      },
      {
        model: Group,
      },
    ]
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Error retrieving groupEnrolements"
    });
  });
}

exports.findAllStudentsNotInAGroup = (req, res) => {
  Student.findAll({
    include: [
      {
        model: StudentGroup,
        attributes: []
      },
      {
        model: UserAccounts,
        attributes: {
          exclude: ['password']
        },
      }
    ],
    where: {
      '$StudentGroups.StudentID$': null
    }
  }).then(users => {
    const students = [];

    users.map((student) => {
      students.push({
        id: student.id,
        name: student.name,
        username: student.UserAccount.username
      })
    })
    res.send(students);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Error retrieving users not in a group."
    });
  });
}

exports.findAllStudentsInGroup = (req, res) => {
  const groupId = req.params.id;
  Student.findAll({
    include: [
      { model: UserAccounts },
      {
        model: StudentGroup,
        where: { GroupID: groupId }
      }
    ]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: err.message || "Error retrieving data"
      });
    });
};

exports.getCountOfStudentsInGroup = (req, res) => {
  const groupId = req.params.id
  StudentGroup.count({
    where: { GroupID: groupId }
  }).then(studentsCount => {
    res.send({ count: studentsCount })
  })
}

exports.update = (req, res) => {
  const id = req.params.id;
  const newGroupId = req.body.GroupID;
  const newUserId = req.body.UserID;
  const date = req.body.Date;

  if (!newGroupId || !newUserId || !date) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  StudentGroup.findOne({ where: { id: id } }).then(data => {
    if (!data) {
      return res.status(404).send({
        message: "Data not found"
      });
    }
    const groupEnrolement = {
      StudentID: newUserId,
      GroupID: newGroupId,
      Date: date
    }

    StudentGroup.update(
      groupEnrolement,
      { where: { id: id } }
    ).then(data => {
      res.send({
        message: "Updated succesfully"
      });
    }).catch(err => {
      return res.status(500).send({
        message: err.message || "Some error occurred while updating the data."
      });
    })
  }).catch(err => {
    return res.status(500).send({
      message: err.message || "Error retrieving data."
    });
  })
}

exports.remove = (req, res) => {
  const id = req.params.id;
  StudentGroup.destroy({
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      return res.send({
        message: "Group enrolement was deleted successfully!"
      });
    } else {
      return res.send({
        message: `Cannot delete Group enrolement`
      });
    }
  }).catch(err => {
    return res.status(500).send({
      message: err.message || "Could not delete Group enrolement with id=" + id
    });
  });
};

exports.unAssignStudent = (req, res) => {
  const { userId, groupId } = req.params;
  StudentGroup.destroy({
    where: { StudentID: userId, groupId: groupId }
  }).then(num => {
    if (num == 1) {
      return res.send({
        message: "Group enrolement was deleted successfully!"
      });
    } else {
      return res.send({
        message: `Cannot delete Group enrolement`
      });
    }
  }).catch(err => {
    return res.status(500).send({
      message: err.message || "Could not delete Group enrolement with id=" + id
    });
  });
};