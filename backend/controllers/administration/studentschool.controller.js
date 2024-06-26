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

exports.AssignStudentToSchool = async (schoolId, studentId, res) => {
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

    if (res && res.send) {
      return res.send(newStudent);
    } else {
      console.log("Response object not properly defined");
    }
  } catch (error) {
    console.error(error);
    if (res && res.status && res.send) {
      return res.status(500).send({ error: true, message: "Error del servidor. No se pudo agregar al estudiante a la escuela." });
    } else {
      console.log("Response object not properly defined");
    }
  }
};

exports.updateStudentSchoolById = async (studentId, schoolId) => {
  try {
    if (schoolId === '') {
      await StudentSchool.destroy({ where: { StudentID: studentId } });

    } else {
      let studentSchool = await StudentSchool.findOne({ where: { StudentID: studentId } });

      if (!studentSchool) {
        await StudentSchool.create({ StudentID: studentId, SchoolID: schoolId });
      } else {
        await StudentSchool.update(
          { SchoolID: schoolId },
          { where: { StudentID: studentId } }
        );
      }
    }
  } catch (error) {
    console.error(error);
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