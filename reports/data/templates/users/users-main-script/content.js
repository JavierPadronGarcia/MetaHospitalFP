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

async function fetchUsers(token) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:12080/api/users`,
            getOptions(token)).then(response => {
            resolve(response.data)
        }).catch(err => {
            reject(err.message);
        })
    })
}

async function beforeRender(req, res) {
    const token = req.data.token;
    req.data.users = await fetchUsers(token);
}