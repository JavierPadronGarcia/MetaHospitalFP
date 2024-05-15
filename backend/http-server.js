require('dotenv').config();
const { exec } = require('child_process');
const jwt = require('jsonwebtoken');
const express = require("express");
const cors = require("cors");
var path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
  origin: "*"
}

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const db = require("./models");

//normal use. Doesn't delete the database data
db.sequelize.sync();

// In development, it drops the database data
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
//   exec('sequelize db:seed:all', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error al ejecutar los seeders: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       return;
//     }
//     console.log(`Seeders ejecutados correctamente: ${stdout}`);
//   });
// })

app.use(function (req, res, next) {
  var token = req.headers['authorization'];
  if (!token) return next();

  if (req.headers.authorization.indexOf('Basic ') === 0) {
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    req.body.username = username;
    req.body.password = password;

    return next();
  }

  token = token.replace('Bearer ', '');


  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.sendStatus(401).json({
        error: true,
        message: "Invalid user."
      });

    } else {
      req.user = user;
      req.token = token;
      next();
    }
  })

})

require('./routes/roleManagement/user.routes')(app);
require('./routes/roleManagement/admin.routes')(app);
require("./routes/administration/group.routes")(app);
require("./routes/administration/teachercourse.routes")(app);
require("./routes/administration/studentgroup.routes")(app);
require("./routes/roleManagement/student.routes")(app);
require("./routes/roleManagement/teacher.routes")(app);
require("./routes/educational/workunit.routes")(app);
require("./routes/educational/case.routes")(app);
require("./routes/educational/item.routes")(app);
require("./routes/educational/exercise.routes")(app);
require("./routes/educational/grade.routes")(app);
require("./routes/educational/color.routes")(app);
require("./routes/educational/workunitcolors.routes")(app);
require("./routes/educational/workunitgroup.routes")(app);
require("./routes/administration/studentschool.routes")(app);
require("./routes/administration/teacherschool.routes")(app);
require("./routes/administration/course.routes")(app);
require("./routes/administration/school.routes")(app);
require("./routes/educational/participation.routes")(app);
require('./routes/administration/activitySubscription.routes')(app);
require('./routes/educational/messages.routes')(app);
require('./routes/management/educationalManagement.routes')(app);

module.exports = app;