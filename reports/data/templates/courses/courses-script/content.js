const axios = require('axios');

function getOptions(token) {
    let bearerAccess = 'Bearer ' + token;

    let options = {
        headers: {
            'Authorization': bearerAccess,
        }
    }
    return options;
}

async function fetchCourses(token, schoolId) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:12080/api/courses/${schoolId}`,
            getOptions(token)).then(response => {
            resolve(response.data)
        }).catch(err => {
            reject(err.message);
        })
    })
}

async function beforeRender(req, res) {
    const token = req.data.token;
    const schoolId = req.data.schoolId;
    req.data.courses = await fetchCourses(token, schoolId);
}