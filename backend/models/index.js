'use strict';

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/db.config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Role Management
db.application = require("./roleManagement/application.model.js")(sequelize, Sequelize);
db.role = require('./roleManagement/role.model.js')(sequelize, Sequelize);
db.userAccounts = require('./roleManagement/userAccounts.model.js')(sequelize, Sequelize);
db.tokenJWT = require('./roleManagement/token_jwt.model.js')(sequelize, Sequelize);
db.student = require('./roleManagement/student.model.js')(sequelize, Sequelize);
db.teacher = require('./roleManagement/teacher.model.js')(sequelize, Sequelize);
db.admin = require('./roleManagement/admin.model.js')(sequelize, Sequelize);
db.userRole = require('./roleManagement/userRole.model.js')(sequelize, Sequelize);

// Administration
db.course = require('./administration/course.model.js')(sequelize, Sequelize);
db.school = require('./administration/school.model.js')(sequelize, Sequelize);
db.groups = require("./administration/group.model.js")(sequelize, Sequelize);
db.studentSchool = require('./administration/studentschool.model.js')(sequelize, Sequelize);
db.teacherSchool = require('./administration/teacherschool.model.js')(sequelize, Sequelize);
db.studentGroup = require('./administration/studentgroup.model.js')(sequelize, Sequelize);
db.teacherGroup = require('./administration/teachergroup.model.js')(sequelize, Sequelize);

// Educational
db.workUnit = require('./educational/workunit.model.js')(sequelize, Sequelize);
db.case = require('./educational/case.model.js')(sequelize, Sequelize);
db.item = require('./educational/item.model.js')(sequelize, Sequelize);
db.exercise = require('./educational/exercise.model.js')(sequelize, Sequelize);
db.participation = require('./educational/participation.model.js')(sequelize, Sequelize);
db.grade = require('./educational/grade.model.js')(sequelize, Sequelize);
db.color = require('./educational/color.model.js')(sequelize, Sequelize);
db.workUnitGroup = require('./educational/workunitGroup.model.js')(sequelize, Sequelize);
db.workUnitColor = require('./educational/workUnitColor.model.js')(sequelize, Sequelize);
db.itemPlayerRole = require('./educational/itemplayerrole.model.js')(sequelize, Sequelize);
db.playerRole = require('./educational/playerrole.model.js')(sequelize, Sequelize);

// Role Management Relations
db.application.hasMany(db.userRole, { foreignKey: 'AppID' });
db.role.hasMany(db.userRole, { foreignKey: 'RoleID' });
db.userAccounts.hasMany(db.userRole, { foreignKey: 'UserID' });
db.tokenJWT.belongsTo(db.userAccounts, { foreignKey: 'UserID' });

db.userAccounts.hasOne(db.student, { foreignKey: 'id' });
db.userAccounts.hasOne(db.teacher, { foreignKey: 'id' });
db.userAccounts.hasOne(db.admin, { foreignKey: 'id' });

// Administration relations
db.student.hasMany(db.studentSchool, { foreignKey: 'StudentID' });
db.student.hasMany(db.studentGroup, { foreignKey: 'StudentID' });

db.teacher.hasMany(db.teacherSchool, { foreignKey: 'TeacherID' });
db.teacher.hasMany(db.teacherGroup, { foreignKey: 'TeacherID' });

db.school.hasMany(db.studentSchool, { foreignKey: 'SchoolID' });
db.school.hasMany(db.teacherSchool, { foreignKey: 'SchoolID' });

db.groups.hasMany(db.studentGroup, { foreignKey: 'GroupID' });
db.groups.hasMany(db.teacherGroup, { foreignKey: 'GroupID' });

db.school.hasMany(db.groups, { foreignKey: 'SchoolID' });
db.course.hasMany(db.groups, { foreignKey: 'CourseID' });

// Educational Relations
db.groups.hasMany(db.workUnitGroup, { foreignKey: 'GroupID' });

db.workUnit.hasMany(db.workUnitGroup, { foreignKey: 'WorkUnitID' });
db.workUnit.hasMany(db.case, { foreignKey: 'WorkUnitID' });

db.color.hasMany(db.workUnitColor, { foreignKey: 'ColorID' });
db.workUnitGroup.hasMany(db.workUnitColor, { foreignKey: 'WorkUnitGroupID' });

db.case.hasMany(db.item, { foreignKey: 'CaseID' });

db.item.hasMany(db.itemPlayerRole, { foreignKey: 'ItemID' });
db.playerRole.hasMany(db.itemPlayerRole, { foreignKey: 'PlayerRoleID' });

db.itemPlayerRole.hasMany(db.grade, { foreignKey: 'ItemPlayerRoleID' });

db.case.hasMany(db.exercise, { foreignKey: 'CaseID' });
db.exercise.hasMany(db.participation, { foreignKey: 'ExerciseID' });
db.users.hasMany(db.participation, {foreignKey: 'UserId'});

db.participation.hasMany(db.grade, { foreignKey: 'ParticipationID' });

db.student.hasMany(db.participation, { foreignKey: 'StudentID' });
db.groups.hasMany(db.messages, { foreignKey: 'GroupID' });

//subscriptions relations
db.users.hasMany(db.activitySubscription, { foreignKey: 'UserID' })
db.activitySubscription.belongsTo(db.users, {foreignKey: 'UserID'});

//course relations
db.course.belongsTo(db.school, { throw: 'SchoolId'})

module.exports = db;