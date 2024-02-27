const db = require("../../models");
const StudentSchool = db.studentSchool;
const Student = db.student;
const UserAccount = db.userAccounts;

exports.getStudentsBySchool = async (req, res) => {
  const schoolId = req.params.schoolId;

  try {
    const students = await StudentSchool.findAll({
      where: {
        SchoolId: schoolId
      },
      include: [{
        model: Student,
        include: [
          { model: UserAccount }
        ]
      }],
    });

    const formattedStudents = students.map((student) => {
      return {
        id: student.StudentID,
        username: student.Student.UserAccount.username,
        name: student.Student.name,
        role: 'student'
      };
    })

    res.send(formattedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error. Couldn't fetch students." });
  }
};


exports.addStudentToSchool = async (req, res) => {
  const studentId = req.body.studentId;
  const schoolId = req.params.schoolId;

  try {

    const student = await Student.findOne({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(404).send({ error: true, message: "Usuario no encontrado" });
    }

    const newStudent = await StudentSchool.create({
      StudentID: studentId,
      SchoolID: schoolId
    });

    return res.send(newStudent);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: true, message: "Error del servidor. No se pudo agregar al estudiante a la escuela." });
  }
};

exports.deleteStudentFromSchool = async (req, res) => {
  const userId = req.params.userId;
  const schoolId = req.params.schoolId;

  try {
    await StudentSchool.destroy({
      where: {
        StudentID: userId,
        SchoolID: schoolId,
      }
    });

    return res.send({ message: 'Deleted' });

  } catch (error) {
    return res.status(500).send({ message: "Error del servidor. No se pudo eliminar al estudiante de la escuela." });
  }
};