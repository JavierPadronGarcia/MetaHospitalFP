import axios from "axios";

import { backendGradesEndpoint } from "../constants/backendEndpoints";

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
  

async function getGradesByExercises (exerciseId) {
    try {
        const response = await axios.get(`${backendGradesEndpoint}/findGradesByStudentInExercise/${exerciseId}`,
          getOptions(localStorage.getItem('token'))
        );
        return response.data;
      } catch (err) {
        throw err;
      }
}

export default {
    getGradesByExercises
}