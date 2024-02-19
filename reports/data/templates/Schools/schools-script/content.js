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
    const token = req.data.token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJKb3JnZSBNZWzDqW5kZXogR29kb3kiLCJwYXNzd29yZCI6IiQyYSQxMCR4TUQ2dkx2eGRtS2ZWeEg1Z01MQ2p1UjdJa1BVY3Q0MGlMaVZPOHNwU2xJN0l0bDIxVC5oZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwODM2MTkwOCwiZXhwIjoxNzA4NDQ4MzA4fQ.ArWtwn7MaE6q3cG8QxdEQv4J-OIvvPb_tuk6oFnXENk'; 
    req.data.schools = await prepareDataSource(schoolId, token);
}

