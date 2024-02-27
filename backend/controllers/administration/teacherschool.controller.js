const db = require("../../models");
const TeacherSchool = db.teacherSchool;
const UserAccount = db.userAccounts;
const Teacher = db.teacher;

exports.getTeachersBySchool = async (req, res) => {
  const schoolId = req.params.schoolId;

  try {
    const teachers = await TeacherSchool.findAll({
      where: {
        SchoolId: schoolId
      },
      include: [{
        model: Teacher,
        include: [
          { model: UserAccount }
        ]
      }],
    });

    const formattedTeachers = teachers.map((teacher) => {
      return {
        id: teacher.TeacherID,
        username: teacher.Teacher.UserAccount.username,
        name: teacher.Teacher.name,
        role: 'teacher'
      };
    })

    res.send(formattedTeachers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error. Couldn't fetch teachers." });
  }
};


exports.addTeacherToSchool = async (req, res) => {
  const userId = req.body.UserId;
  const schoolId = req.params.schoolId;

  try {

    const user = await Teacher.findOne({
      where: {
        id: userId,
      }
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado o no es un profesor." });
    }

    const newTeacher = await TeacherSchool.create({
      TeacherID: userId,
      SchoolID: schoolId
    });

    res.send(newTeacher);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error del servidor. No se pudo agregar al profesor a la escuela." });
  }
};

exports.deleteTeacherFromSchool = async (req, res) => {
  const userId = req.params.userId;
  const schoolId = req.params.schoolId;

  try {
    await TeacherSchool.destroy({
      where: {
        TeacherID: userId,
        SchoolID: schoolId,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error del servidor. No se pudo eliminar al estudiante de la escuela." });
  }
};