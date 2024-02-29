import axios from "axios";
import { backendGroupsEndpoint } from '../constants/backendEndpoints';

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

async function getAllGroupsWithoutCount(schoolId) {
  try {
    const response = await axios.get(`${backendGroupsEndpoint}/school/${schoolId}`,
      getOptions(localStorage.getItem("token"))
    );
    const groups = await response.data;
    return groups;
  } catch (err) {
    throw err;
  }
}

async function getAllGroups() {
  try {
    const response = await axios.get(backendGroupsEndpoint + '/withCounts',
      getOptions(localStorage.getItem("token"))
    );
    const groups = await response.data;
    return groups;
  } catch (err) {
    throw err;
  }
}

async function getGroup(id) {
  try {
    const response = await axios.get(backendGroupsEndpoint + '/' + id,
      getOptions(localStorage.getItem("token"))
    );
    const group = await response.data;
    return group;
  } catch (err) {
    throw err;
  }
}

async function getUserGroup() {
  try {
    const response = await axios.get(backendGroupsEndpoint + '/userGroup', getOptions(localStorage.getItem("token")))
    const group = await response.data;
    return group;
  } catch (err) {
    throw err;
  }
}

async function addGroup(group, schoolId) {
  const body = new URLSearchParams();
  body.append("name", group.name);
  body.append("date", group.date);
  body.append("CourseId", group.CourseId);
  body.append("schoolId", schoolId);
  let response = [];
  try {
    response = await axios.post(backendGroupsEndpoint,
      body,
      getOptions(localStorage.getItem("token"))
    );
  } catch (err) {
    throw err;
  }
  return response.status;
}

async function updateGroup(updatedGroup) {
  const body = new URLSearchParams();
  body.append("name", updatedGroup.name);
  body.append("date", updatedGroup.date);
  body.append("CourseId", updatedGroup.CourseId);

  try {
    const response = await axios.put(`${backendGroupsEndpoint}/${updatedGroup.id}`,
      body,
      getOptions(localStorage.getItem("token"))
    );
    return response;
  } catch (err) {
    throw err;
  }
}

async function deleteGroup(id) {
  try {
    const response = await axios.delete(`${backendGroupsEndpoint}/${id}`,
      getOptions(localStorage.getItem("token"))
    );

    return response;
  } catch (err) {
    throw err;
  }
}

export default {
  getAllGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  getAllGroupsWithoutCount,
  getGroup,
  getUserGroup
}