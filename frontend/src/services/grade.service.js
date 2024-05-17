import axios from "axios";
import i18next from "i18next";
import { backendGradesEndpoint } from "../constants/backendEndpoints";

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
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getAllGradesOnAGroup(groupId) {
  try {
    const response = await axios.get(`${backendGradesEndpoint}/findAllGradesOfTheGroup/${groupId}`,
      getOptions(localStorage.getItem('token'))
    );
    return response.data;
  } catch (err) {
    throw err;
  }
}

export default {
  getGradesByExercises,
  getAllGradesOnAGroup
}