exports.addRoles = (roles) => {
  const roleArray = roles.map((role, index) => ({
    id: index + 1,
    name: role,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return roleArray;
}

exports.addApplications = (applications) => {
  const applicationArray = applications.map((application, index) => ({
    id: index + 1,
    app_name: application,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return applicationArray;
}

exports.addSchools = (schools) => {
  const schoolsArray = schools.map((school, index) => ({
    id: index + 1,
    name: school,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return schoolsArray;
}

exports.addCourses = (courses) => {
  const coursesArray = courses.map((course, index) => ({
    id: index + 1,
    name: course.name,
    acronyms: course.acronyms,
    SchoolID: course.schoolId,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return coursesArray;
}

exports.addGroups = (groups) => {
  const groupsArray = groups.map((group, index) => ({
    id: index + 1,
    name: group.name,
    date: group.date,
    CourseId: group.CourseId,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return groupsArray;
}

exports.addUserRoles = ({ admins, teachers, students }) => {
  const userRolesArray = [
    ...admins.map(admin => ({ UserID: admin.id, AppID: 1, RoleID: 1, createdAt: new Date(), updatedAt: new Date() })),
    ...teachers.map(teacher => ({ UserID: teacher.id, AppID: 1, RoleID: 2, createdAt: new Date(), updatedAt: new Date() })),
    ...students.map(student => ({ UserID: student.id, AppID: 1, RoleID: 3, createdAt: new Date(), updatedAt: new Date() }))
  ];
  return userRolesArray;
}

exports.addStudentGroups = (studentGroups, dateStr) => {
  const date = new Date(dateStr);
  return studentGroups.map((studentGroup, index) => ({
    id: index + 1,
    StudentID: studentGroup.StudentID,
    GroupID: studentGroup.GroupID,
    Date: date,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

exports.addTeacherGroups = (teacherGroups, dateStr) => {
  const date = new Date(dateStr);
  return teacherGroups.map((teacherGroup, index) => ({
    id: index + 1,
    TeacherID: teacherGroup.TeacherID,
    GroupID: teacherGroup.GroupID,
    Date: date,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

exports.addTeacherSchools = (teacherSchools) => {
  return teacherSchools.map((teacherSchool) => ({
    TeacherID: teacherSchool.TeacherID,
    SchoolID: teacherSchool.SchoolID,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

exports.addStudentSchools = (dataArray) => {
  return dataArray.flatMap(({ startStudentId, endStudentId, schoolId }) =>
    Array.from({ length: endStudentId - startStudentId + 1 }, (_, index) => ({
      StudentID: startStudentId + index,
      SchoolID: schoolId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
};
exports.getUserAccountsAndUserForRoles = (allUsers) => {
  const userAccounts = allUsers.map(user => ({
    id: user.id,
    username: user.username,
    password: user.password,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  const rolesMap = {
    admin: user => ({
      id: user.id,
      name: user.name,
      age: user.age,
      SchoolID: user.SchoolID || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    student: user => ({
      id: user.id,
      name: user.name,
      age: user.age,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    teacher: user => ({
      id: user.id,
      isDirector: user.isDirector || false,
      name: user.name,
      age: user.age,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  };

  const admins = allUsers.filter(user => user.role === 'admin').map(rolesMap.admin);
  const students = allUsers.filter(user => user.role === 'student').map(rolesMap.student);
  const teachers = allUsers.filter(user => user.role === 'teacher').map(rolesMap.teacher);

  return { users: userAccounts, admins, teachers, students };
};


exports.replacePunctuationMarks = (str) => {
  const punctuationWords = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
  };

  return str.replace(/[áéíóúÁÉÍÓÚ]/g, match => punctuationWords[match]);
};

exports.addWorkUnits = (workUnits) => {
  const workUnitsArray = workUnits.map((workUnit, index) => ({
    id: index + 1,
    name: workUnit,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return workUnitsArray;
}

exports.addColors = (colors) => {
  const colorsArray = colors.map((color, index) => ({
    id: index + 1,
    ...color,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return colorsArray;
}

exports.addWorkUnitColors = (workUnitColors) => {
  const workUnitColorsArray = workUnitColors.map((workUnitColor, index) => ({
    id: index + 1,
    ...workUnitColor,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return workUnitColorsArray;
}

exports.addWorkUnitGroups = (workUnitGroups) => {
  const workUnitGroupsArray = workUnitGroups.map((workUnitGroup, index) => ({
    id: index + 1,
    ...workUnitGroup,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return workUnitGroupsArray;
}

exports.addCases = (data) => {
  let idCounter = 1;
  return data.flatMap(({ cases, workUnitID }) =>
    cases.map((name, index) => ({
      id: idCounter++,
      WorkUnitID: workUnitID,
      name,
      caseNumber: index + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
};

exports.addExercises = (exercises) => {
  const exercisesArray = exercises.map((exercise, index) => ({
    id: index + 1,
    ...exercise,
    finishDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return exercisesArray;
}

exports.addParticipations = (participations) => {
  const participationsArray = participations.map((participation, index) => ({
    id: index + 1,
    ...participation,
    SubmittedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  return participationsArray;
}

exports.addItems = (data) => {
  let idCounter = 1;
  return data.flatMap(({ items, caseID }) =>
    items.map((item) => ({
      id: idCounter++,
      CaseID: caseID,
      name: item,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
};

exports.addGrades = (data) => {
  let idCounter = 1;

  return data.flatMap(({ allGrades, participationId }) =>
    allGrades.map(({ correct, grade, itemId }) => ({
      id: idCounter++,
      correct,
      grade,
      ItemID: itemId,
      ParticipationID: participationId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
};