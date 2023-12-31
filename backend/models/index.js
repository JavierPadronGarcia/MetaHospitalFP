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

db.groups = require("./group.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.teachercourse = require("./teachercourse.model.js")(sequelize, Sequelize);
db.groupEnrolement = require("./groupenrolement.model.js")(sequelize, Sequelize);
db.workUnit = require('./workunit.model.js')(sequelize, Sequelize);
db.case = require('./case.model.js')(sequelize, Sequelize);
db.item = require('./item.model.js')(sequelize, Sequelize);
db.exercise = require('./exercise.model.js')(sequelize, Sequelize);
db.grade = require('./grade.model.js')(sequelize, Sequelize);
db.color = require('./color.model.js')(sequelize, Sequelize);
db.workUnitColor = require('./workUnitColor.model.js')(sequelize, Sequelize);
db.workUnitGroup = require('./workunitGroup.model.js')(sequelize, Sequelize);
db.studentSchool = require('./studentschool.model.js')(sequelize, Sequelize);
db.school = require('./school.model.js')(sequelize, Sequelize);
db.teacherSchool = require('./teacherschool.model.js')(sequelize, Sequelize);
db.course = require('./course.model.js')(sequelize, Sequelize);
db.participation = require('./participation.model.js')(sequelize, Sequelize)

//user, student-school, teacher-school relations

db.school.belongsToMany(db.users, { through: db.studentSchool });
db.school.belongsToMany(db.users, { through: db.teacherSchool });

db.teacherSchool.belongsTo(db.school);
db.teacherSchool.belongsTo(db.users);

db.studentSchool.belongsTo(db.school);
db.studentSchool.belongsTo(db.users);

//user groups

db.users.belongsToMany(db.school, { through: db.studentSchool });
db.users.belongsToMany(db.school, { through: db.teacherSchool });

db.users.belongsTo(db.school, { through: 'AdminSchoolId' });

//teacher - groups relations
db.users.hasMany(db.teachercourse, { foreignKey: 'UserID' });
db.groups.hasMany(db.teachercourse, { foreignKey: 'GroupID' });

db.teachercourse.belongsTo(db.users, { foreignKey: 'UserID' });
db.teachercourse.belongsTo(db.groups, { foreignKey: 'GroupID' });

//student - groups relations
db.users.hasMany(db.groupEnrolement, { foreignKey: 'UserID' });
db.groups.hasMany(db.groupEnrolement, { foreignKey: 'GroupID' });

db.groupEnrolement.belongsTo(db.users, { foreignKey: 'UserID' });
db.groupEnrolement.belongsTo(db.groups, { foreignKey: 'GroupID' });

//work unit - case relations
db.workUnit.hasMany(db.case, { foreignKey: 'WorkUnitId' });

//work unit - color relations
db.workUnit.hasMany(db.workUnitColor, { foreignKey: 'WorkUnitId' });
db.color.hasMany(db.workUnitColor, { foreignKey: 'ColorId' });

db.workUnitColor.belongsTo(db.workUnit, { foreignKey: 'WorkUnitId' });
db.workUnitColor.belongsTo(db.color, { foreignKey: 'ColorId' });

//work unit - groups relations
db.groups.hasMany(db.workUnitGroup, { foreignKey: 'GroupID' });
db.workUnit.hasMany(db.workUnitGroup, { foreignKey: 'WorkUnitID' });

db.workUnitGroup.belongsTo(db.groups, { foreignKey: 'GroupID' });
db.workUnitGroup.belongsTo(db.workUnit, { foreignKey: 'WorkUnitID' });

//items - cases relations
db.case.hasMany(db.item, { foreignKey: 'CaseId' });

//exercises relations
db.exercise.belongsTo(db.case, { foreignKey: 'CaseID' });

db.participation.belongsTo(db.exercise, { foreignKey: 'ExerciseId' });
db.participation.belongsTo(db.users, { foreignKey: 'UserId' });

//grade relations
db.grade.belongsTo(db.item, { foreignKey: 'ItemID' });
db.grade.belongsTo(db.participation, { foreignKey: 'ParticipationID' });

//groups relations
db.groups.belongsTo(db.course, { through: 'CourseId' });

module.exports = db;