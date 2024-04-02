const { getCases, getItems } = require('./xslxReader');

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
    ...group,
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
    code: user.code,
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
  const workUnitsArray = workUnits.map(workUnit => ({
    id: workUnit.id,
    name: workUnit.name,
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

exports.addCases = (workUnitId) => {
  const casesFromExcel = getCases(workUnitId);

  return casesFromExcel.map((eachCase) => ({
    WorkUnitID: eachCase.workUnitID,
    name: eachCase.name,
    caseNumber: eachCase.caseNumber,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
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

exports.addItems = (workUnitId) => {
  const items = getItems(workUnitId);
  return items.map(item => ({
    name: item.name,
    itemNumber: item.itemNumber,
    description: item.description,
    value: item.value,
    WorkUnitID: workUnitId,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
};

exports.addGrades = (data) => {
  let idCounter = 1;

  return data.flatMap(({ allGrades, participationId }) =>
    allGrades.map((grade) => ({
      id: idCounter++,
      ...grade,
      ParticipationID: participationId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
};

exports.addPlayerRoles = (playerRoles) => {
  return playerRoles.map((playerRole, index) => ({
    id: ++index,
    name: playerRole,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

exports.addItemPlayerRoles = () => {
  const allItems = getItems(10);
  let index = 1;

  return allItems.flatMap(({ id, roles }) =>
    roles.map((playerRoleId) => ({
      id: index++,
      ItemID: id,
      PlayerRoleID: playerRoleId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
}

exports.addItemNumberCaseNumbers = (workUnitId) => {
  const allCases = getCases(workUnitId);

  const allItemNumberCaseNumbers = allCases.flatMap(({ caseNumber, Items }) =>
    Items.map((itemNumber) => {
      return {
        caseNumber: Number(caseNumber),
        itemNumber: Number(itemNumber) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  );

  return filterItemNumberCaseNumbersDuplicates(allItemNumberCaseNumbers);
}

function filterItemNumberCaseNumbersDuplicates(jsonArray) {
  const uniqueSet = new Set();
  const result = [];

  jsonArray.forEach(obj => {
    const key = obj.caseNumber + '-' + obj.itemNumber;
    if (!uniqueSet.has(key)) {
      result.push(obj);
      uniqueSet.add(key);
    }
  });

  return result;
}