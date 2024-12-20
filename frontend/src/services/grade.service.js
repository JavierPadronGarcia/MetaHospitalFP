import axios from "axios";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import i18next from "i18next";
import { backendGradesEndpoint } from "../constants/backendEndpoints";

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

async function getGradesByExercises(exerciseId) {
  try {
    const response = await axios.get(`${backendGradesEndpoint}/findGradesByStudentInExercise/${exerciseId}`,
      getOptions(localStorage.getItem('token'))
    );
    return parseDate(response).data;
  } catch (err) {
    throw err;
  }
}

async function getAllGradesOnAGroup(groupId) {
  try {
    const response = await axios.get(`${backendGradesEndpoint}/findAllGradesOfTheGroup/${groupId}`,
      getOptions(localStorage.getItem('token'))
    );
    return parseDate(response).data;
  } catch (err) {
    throw err;
  }
}

async function getAllGradesOnAGroupForExcel(groupId) {
  try {
    const response = await axios.get(`${backendGradesEndpoint}/findAllGradesInGroupForExcel/${groupId}`,
      getOptions(localStorage.getItem('token'))
    );

    if (response.data.length !== 0) {
      const userTimeZone = dayjs.tz.guess();
      response.data.forEach(exercise => {
        exercise["Submit Date"] = dayjs(exercise["Submit Date"] + "T" + exercise["Submit Time"] + "Z").tz(userTimeZone).format("YYYY-MM-DD");
        exercise["Submit Time"] = dayjs(exercise["Submit Date"] + "T" + exercise["Submit Time"] + "Z").tz(userTimeZone).format("HH:mm:ss");
      })
    }

    return response.data;
  } catch (err) {
    throw err;
  }
}

function parseDate(response) {
  if (response.data.length !== 0) {
    const userTimeZone = dayjs.tz.guess();
    response.data.forEach(participation => {
      participation.submittedAt = dayjs(participation.submittedAt).tz(userTimeZone).format("YYYY-MM-DD HH:mm:ss");
    })
  }
  return response;
}

export default {
  getGradesByExercises,
  getAllGradesOnAGroup,
  getAllGradesOnAGroupForExcel
}