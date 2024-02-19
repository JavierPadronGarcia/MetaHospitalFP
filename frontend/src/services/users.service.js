import axios from "axios";
import { backendUsersEndpoint } from '../constants/backendEndpoints';

const encodeCredentials = (email, password) => {
  return btoa(`${email}:${password}`);
};

function getOptions(token) {
  let bearerAccess = 'Bearer ' + token;

  let options = {
    headers: {
      'Authorization': bearerAccess,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return options;
}

function getOptionsImageFormat(token) {
  let bearerAccess = 'Bearer ' + token;

  let options = {
    headers: {
      'Authorization': bearerAccess,
      'Content-Type': 'multipart/form-data'
    }
  }
  return options;
}

async function getAllDirectors() {
  try {
    const response = await axios.get(backendUsersEndpoint + '/directors',
      getOptions(localStorage.getItem('token'))
    );

    const directors = await response.data;
    return directors;
  } catch (err) {
    throw err;
  }
}

async function getUserById(id) {
  try {
    const response = await axios.get(backendUsersEndpoint + '/' + id,
      getOptions(localStorage.getItem('token'))
    );
    const user = response.data;
    return user;
  } catch (err) {
    throw err;
  }
}

async function getUsers() {
  try {
    const response = await axios.get(backendUsersEndpoint,
      getOptions(localStorage.getItem('token'))
    );
    const user = response.data;
    return user;
  } catch (err) {
    throw err;
  }
}

async function getStudents() {
  try {
    const response = await axios.get(backendUsersEndpoint + '/students',
      getOptions(localStorage.getItem('token'))
    );
    const user = response.data;
    return user;
  } catch (err) {
    throw err;
  }
}

async function getTeachers() {
  try {
    const response = await axios.get(backendUsersEndpoint + '/teachers',
      getOptions(localStorage.getItem('token'))
    );
    const user = response.data;
    return user;
  } catch (err) {
    throw err;
  }
}


async function deleteUser(id) {
  try {
    const response = await axios.delete(backendUsersEndpoint + '/' + id,
      getOptions(localStorage.getItem('token'))
    );
    const user = response.data;
    return user;
  } catch (err) {
    throw err;
  }
}

export const createNewUser = async (potUser, email) => {
  try {
    const password = 'metahospital';
    const response = await axios.post(backendUsersEndpoint, potUser, {
      headers: {
        Authorization: `Basic ${encodeCredentials(email, password)}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

async function assignDirector(prevDirectorId, newDirectorId) {
  try {
    const body = new URLSearchParams();
    if (prevDirectorId) {
      body.append('directorId', prevDirectorId);
    }
    const response = await axios.put(`${backendUsersEndpoint}/assignDirector/${newDirectorId}`,
      body,
      getOptions(localStorage.getItem('token'))
    );

    return response;
  } catch (err) {
    throw err;
  }
}


async function updateUserWithImage(newUsername, newImage, prevImageName) {
  try {
    const body = new FormData();

    if (prevImageName) {
      body.append('previousImage', prevImageName);
    } else {
      body.append('previousImage', '');
    }

    if (newUsername) {
      body.append('newUsername', newUsername);
    }
    body.append('file', newImage);

    const response = await axios.put(`${backendUsersEndpoint}/image`,
      body,
      getOptionsImageFormat(localStorage.getItem('token'))
    );

    return response;
  } catch (err) {
    throw err;
  }
}


async function updateUserWithoutImage(newUsername, userId, newUserRole, newName) {
  try {
    if (!newUserRole) { newUserRole = '' }
    if (!newName) { newName = '' }

    const token = localStorage.getItem('token');

    const body = new URLSearchParams();
    body.append('username', newUsername);
    body.append('role', newUserRole);
    body.append('name', newName);

    const response = await axios.put(`${backendUsersEndpoint}/noimage/${userId}`,
      body,
      getOptions(token)
    );

    return response;
  } catch (err) {
    throw err;
  }
}

async function assignCode() {
  let fechaExpiracion = new Date().getTime() + (24 * 60 * 60 * 1000);
  fechaExpiracion = new Date(fechaExpiracion);
  try {
    const response = await axios.put(`${backendUsersEndpoint}/assignCode`, { expDate: fechaExpiracion }, getOptions(localStorage.getItem('token')));
    return response
  } catch (err) {
    throw err
  }
}

async function unAssignCode() {
  try {
    const response = await axios.put(`${backendUsersEndpoint}/unassignCode`, null, getOptions(localStorage.getItem('token')))
    return response
  } catch (err) {
    throw err;
  }
}

export default {
  getAllDirectors,
  getUserById,
  assignDirector,
  updateUserWithImage,
  updateUserWithoutImage,
  assignCode,
  unAssignCode,
  getUsers,
  deleteUser,
  createNewUser,
  getStudents,
  getTeachers
}