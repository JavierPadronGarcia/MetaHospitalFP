const db = require("../../models");
const TeacherGroup = db.teacherGroup;
const User = db.users;
const UserAccount = db.userAccounts;
const Teacher = db.teacher;
const Group = db.groups;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

  if (!req.body.UserID || !req.body.GroupID || !req.body.Date) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const group = {
    TeacherID: req.body.UserID,
    GroupID: req.body.GroupID,
    Date: req.body.Date
  };

  TeacherGroup.create(group).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the teacher."
    });
  });
};

exports.findAll = (req, res) => {
  TeacherGroup.findAll().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Error retrieving groups."
    });
  });
};

exports.findAllOrderedByGroupDesc = (req, res) => {
  TeacherGroup.findAll({
    order: [['GroupID', 'DESC']],
    include: [
      {
        model: User,
        attributes: {
          exclude: ['password']
        }
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

exports.findAllTeachersNotInAGroup = (req, res) => {
  Teacher.findAll({
    where: {
      id: {
        [Op.notIn]: db.Sequelize.literal(`(
          SELECT TeacherID 
          FROM ${TeacherGroup.tableName}
          WHERE ${TeacherGroup.tableName}.GroupID = ${req.params.groupId}
        )`)
      }
    },
    include: [
      {
        model: TeacherGroup,
        attributes: []
      },
      {
        model: UserAccount,
        attributes: {
          exclude: ['password']
        },
      }
    ],
  }).then(users => {
    const teachers = [];

    users.map((teacher) => {
      teachers.push({
        id: teacher.id,
        name: teacher.name,
        username: teacher.UserAccount.username
      })
    })

    res.send(teachers);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Error retrieving users not in a group."
    });
  });
}

exports.findAllTeacherInCourse = (req, res) => {
  const groupId = req.params.id;
  Teacher.findAll({
    include: [
      {
        model: TeacherGroup,
        where: {
          GroupID: groupId
        }
      },
      {
        model: UserAccount,
        attributes: {
          exclude: ['password']
        },
      }
    ]
  }).then(teachers => {
    const formattedTeachers = [];

    teachers.map((teacher) => {
      formattedTeachers.push({
        id: teacher.id,
        name: teacher.name,
        username: teacher.UserAccount.username,
      });
    })

    res.send(formattedTeachers);
  }).catch(err => {
    console.error(err);
    res.status(500).send({
      message: err.message || "Error retrieving data"
    });
  });
};

exports.findAllGroupsByTeacher = (req, res) => {
  const teacherId = req.params.id;
  TeacherGroup.findAll({
    where: { TeacherID: teacherId },
    include: [{ model: Group }]
  }).then(data => {
    res.send(data);
  }).catch(err => {
    console.error(err);
    res.status(500).send({
      message: err.message || "Error retrieving data"
    });
  })
}

exports.getCountOfTeachersInCourse = (req, res) => {
  const groupId = req.params.id
  TeacherGroup.count({
    where: { GroupID: groupId }
  }).then(teacherCount => {
    res.send({ count: teacherCount })
  })
}

exports.update = (req, res) => {
  const prevUserId = req.params.userId;
  const prevGroupId = req.params.groupId;
  const newGroupId = req.body.GroupID;
  const newUserId = req.body.UserID;

  if (!prevUserId || !prevGroupId || !newGroupId || !newUserId) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  TeacherGroup.findOne({ where: { GroupID: prevGroupId, TeacherID: prevUserId } }).then(data => {
    if (!data) {
      return res.status(404).send({
        message: "Data not found"
      });
    }
    const teacherCourse = {
      UserID: newUserId,
      GroupID: newGroupId
    }

    TeacherGroup.update(
      teacherCourse,
      { where: { TeacherID: prevUserId, GroupID: prevGroupId } }
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
  const userId = req.params.userId;
  const groupId = req.params.groupId;

  TeacherGroup.destroy({
    where: { TeacherID: userId, GroupID: groupId }
  }).then(num => {
    if (num == 1) {
      return res.send({
        message: "Teacher Course was deleted successfully!"
      });
    } else {
      return res.send({
        message: `Cannot delete Teacher Course`
      });
    }
  }).catch(err => {
    return res.status(500).send({
      message: err.message || "Could not delete Teacher with id=" + id
    });
  });
};
