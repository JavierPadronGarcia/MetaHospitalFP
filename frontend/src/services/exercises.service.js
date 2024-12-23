import axios from 'axios';
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import i18next from 'i18next';
import { backendExercisesEndpoint } from '../constants/backendEndpoints';

dayjs.extend(utc);
dayjs.extend(timezone);

function getOptions(token) {
  let bearerAccess = 'Bearer ' + token;

  let options = {
    headers: {
      'Authorization': bearerAccess,
      'Content-Type': 'application/x-www-form-urlencoded',
      'required-language-response': i18next.language
    }
  }
  return options;
}

async function getAllExercisesOfTheGroup(groupId, workUnitId) {
  try {
    const response = await axios.get(`${backendExercisesEndpoint}/exercisesinagroup/${groupId}/${workUnitId}`,
      getOptions(localStorage.getItem('token'))
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getAllExercisesAssignedToStudent(groupId, workUnitId) {
  try {
    const response = await axios.get(`${backendExercisesEndpoint}/exercisesAssignedToStudent/${groupId}/${workUnitId}`,
      getOptions(localStorage.getItem('token'))
    );
    return parseDate(response).data;
  } catch (err) {
    throw err;
  }
}

function parseDate(response) {
  if (response.data.length !== 0) {
    const userTimeZone = dayjs.tz.guess();
    response.data.forEach(participation => {
      participation.submittedAt = dayjs(participation.submittedAt).utc().tz(userTimeZone).add(2, 'hour').format("YYYY-MM-DD HH:mm:ss");
    })
  }
  return response;
}

async function addExercises(caseId, students, assigned, date, groupId, workUnitId) {
  const body = new URLSearchParams();
  body.append('CaseID', caseId);
  body.append('Students', students);
  body.append('assigned', assigned || false);
  body.append('finishDate', date);
  body.append('groupId', groupId);
  body.append('workUnitId', workUnitId);

  try {
    const response = axios.post(`${backendExercisesEndpoint}/addExercises`,
      body,
      getOptions(localStorage.getItem('token'))
    );
    return (await response).data;
  } catch (err) {
    throw err;
  }
}

async function updateExercises(updateData) {
  const body = new URLSearchParams();
  body.append('GroupID', updateData.groupId);
  body.append('WorkUnitID', updateData.workUnitId);
  body.append('prevCaseID', updateData.prevCaseId);
  body.append('CaseID', updateData.caseId);
  body.append('Students', updateData.students);
  body.append('prevAssigned', updateData.prevAssigned);
  body.append('assigned', updateData.assigned);
  body.append('prevDate', updateData.prevDate)
  body.append('finishDate', updateData.finishDate);
  console.log(updateData.students)
  try {
    const response = axios.put(`${backendExercisesEndpoint}/updateExercises`,
      body,
      getOptions(localStorage.getItem('token'))
    );
    return (await response).data;
  } catch (err) {
    throw err;
  }
}

async function deleteExercise(activityId) {
  try {
    const response = axios.delete(`${backendExercisesEndpoint}/${activityId}`,
      getOptions(localStorage.getItem('token'))
    );
    return (await response).data;
  } catch (err) {
    throw err;
  }
}

async function getAllStudentsAssignedInActivity(groupId, workUnitId, caseId, assigned, date) {
  try {
    const response = axios.get(`${backendExercisesEndpoint}/studentsAssignedToExercise/${groupId}/${workUnitId}/${caseId}/${assigned}/${date}`,
      getOptions(localStorage.getItem('token'))
    );
    return (await response).data;
  } catch (err) {
    throw err;
  }
}

export default {
  getAllExercisesOfTheGroup,
  addExercises,
  updateExercises,
  deleteExercise,
  getAllStudentsAssignedInActivity,
  getAllExercisesAssignedToStudent
}