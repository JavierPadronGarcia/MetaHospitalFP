var jwt = require('jsonwebtoken');

function generateToken(user) {
  if (!user) return null;

  var u = {
    id: user.id,
    username: user.username,
    name: user.name,
    password: user.password,
    role: user.role
  }

  const token = jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24  //expires in 24 hours
  });

  // const token = jwt.sign(u, process.env.JWT_SECRET, {
  //   expiresIn: 50000 / 1000, //expires in 24 hours
  // });

  const decodeToke = decodeToken(token);

  const date = new Date(decodeToke.exp * 1000);

  const expireDate = date.toISOString();

  return { token: token, expireDate: expireDate };
}

function getCleanUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    password: user.password,
    role: user.role,
    name: user.name
  }
}

function decodeToken(token) {
  token = token.replace('Bearer ', '');
  //decode token bearer
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

module.exports = {
  generateToken,
  getCleanUser,
  decodeToken
}