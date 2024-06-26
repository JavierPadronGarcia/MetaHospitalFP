import axios from 'axios';

import { backendTeacherGroupEndpoint } from '../constants/backendEndpoints';

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

async function getAllOrderedByGroupDesc() {
  try {
    const response = await axios.get(backendTeacherGroupEndpoint + '/orderdesc',
      getOptions(localStorage.getItem('token'))
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getAllTeachersNotInAGroup(groupId) {
  try {
    const response = await axios.get(backendTeacherGroupEndpoint + '/teachernotinagroup/' + groupId,
      getOptions(localStorage.getItem('token'))
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getAllTeachersInAGroup(groupId) {
  try {
    const response = await axios.get(backendTeacherGroupEndpoint + '/group/' + groupId,
      getOptions(localStorage.getItem('token'))
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getAllGroupsAssignedToTeacher(teacherId) {
  try {
    const response = await axios.get(`${backendTeacherGroupEndpoint}/allGroupsAssignedToTeacher/${teacherId}`,
      getOptions(localStorage.getItem('token'))
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function assignTeacherToGroup(teacherid, groupId) {
  const body = new URLSearchParams();
  const date = new Date();
  body.append('GroupID', groupId);
  body.append('UserID', teacherid);
  body.append('Date', date);
  try {
    const response = await axios.post(backendTeacherGroupEndpoint,
      body,
      getOptions(localStorage.getItem('token'))
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function unAssignTeacherToGroup(teacherid, groupId) {
  try {
    const response = await axios.delete(backendTeacherGroupEndpoint + '/' + teacherid + '/' + groupId,
      getOptions(localStorage.getItem('token'))
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}


export default {
  getAllOrderedByGroupDesc,
  getAllTeachersNotInAGroup,
  getAllTeachersInAGroup,
  getAllGroupsAssignedToTeacher,
  assignTeacherToGroup,
  unAssignTeacherToGroup
}