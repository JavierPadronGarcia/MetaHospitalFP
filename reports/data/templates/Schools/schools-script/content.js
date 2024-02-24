const http = require('http');

async function fetchSchools(token) {
    const options = {
        hostname: 'localhost',
        port: 12080,
        path: '/api/schools',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (result) => {
            let str = '';
            result.on('data', (b) => str += b);
            result.on('error', reject);
            result.on('end', () => resolve(JSON.parse(str)));
        });

        req.end();
    });
}

async function fetchStudents(token, id) {
    const options = {
        hostname: 'localhost',
        port: 12080,
        path: `/api/schools/${id}/students`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (result) => {
            let str = '';
            result.on('data', (b) => str += b);
            result.on('error', reject);
            result.on('end', () => resolve(JSON.parse(str)));
        });

        req.end();
    });
}

async function fetchTeachers(token, id) {

    const options = {
        hostname: 'localhost',
        port: 12080,
        path: `/api/schools/${id}/teachers`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (result) => {
            let str = '';
            result.on('data', (b) => str += b);
            result.on('error', reject);
            result.on('end', () => resolve(JSON.parse(str)));
        });

        req.end();
    });
}

async function prepareDataSource(schoolId, token) {
    const schools = await fetchSchools(token);

    const filteredSchools = schoolId ? schools.filter(school => school.id === schoolId) : schools;

    const schoolDataPromises = filteredSchools.map(async (school) => {
        const teachers = await fetchTeachers(token, school.id);
        const students = await fetchStudents(token, school.id);

        return {
            schoolName: school.name,
            teachersCount: teachers.length,
            studentsCount: students.length,
            teachers,
            students
        };
    });

    return Promise.all(schoolDataPromises);
}

async function beforeRender(req, res) {
    const schoolId = req.data.schoolId || null;
    const token = req.data.token; 
    req.data.schools = await prepareDataSource(schoolId, token);
}

