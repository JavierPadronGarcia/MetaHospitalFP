import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { RolesContext } from './context/roles';
import PrivateRoute from './utils/PrivateRoute';

import Login from './pages/login/Login';

import authService from './services/auth.service';
import UserAdmin from './pages/admin-pages/useradmin/useradmin';
import GroupAdmin from './pages/admin-pages/groupsadmin/groupsadmin';
import TeacherSchools from './pages/admin-pages/teacherschool/teacherschool';
import AdminHome from './pages/admin-pages/adminhome/adminhome';
import SchoolsAdmin from './pages/admin-pages/schooladmin/schooladmin';
import AdminSchool from './pages/admin-pages/adminschool/adminschool';
import StudentSchools from './pages/admin-pages/studentschool/studentschool';
import CoursesAdmin from './pages/admin-pages/coursesadmin/coursesadmin';
import AdminCourse from './pages/admin-pages/admincourse/admincourse';

import TeacherMainPage from './pages/teacher-pages/teacher-main-page/TeacherMainPage';
import TeacherGroupPage from './pages/teacher-pages/teacher-group-page/TeacherGroupPage';
import TeacherActivitiesPage from './pages/teacher-pages/teacher-activities-page/TeacherActivitiesPage';
import TeacherGradesPage from './pages/teacher-pages/teacher-grades-page/TeacherGradesPage';

import Studenthome from './pages/student-pages/studenthome/studenthome';
import StudentExercises from './pages/student-pages/studentexercises/studentexercises';

import ChatComponent from './components/chat/ChatComponent';
import UserProfilePage from './pages/profile/profile';
import TeacherSelection from './pages/teacher-pages/teacher-selection/teacher-selection';
import TeacherGroupStudents from './pages/teacher-pages/teacher-group-students/teacher-group-students';
import ExpireToken from './utils/ExpireToken';

function App() {

  const logged = authService.isLoggedIn();
  const roles = useContext(RolesContext);

  if (logged) {

    const token = localStorage.getItem('token');
    const tokenDecoded = jwtDecode(token);
    const role = tokenDecoded.role;
    roles.role = role;

  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute onlyLogged={true} />}>
          <Route path="/myUser" element={<ExpireToken />}>
            <Route path="" element={<UserProfilePage />} />
          </Route>
          <Route path="/chat/:groupId" element={<ExpireToken />}>
            <Route path="" element={<ChatComponent />} />
          </Route>
        </Route>

        <Route path="/admin" element={<ExpireToken />}>
          <Route element={<PrivateRoute permittedRole="admin" />}>
            <Route path="control-panel" element={<AdminHome />} />
            <Route path="users" element={<UserAdmin />} />
            <Route path="schools" element={<SchoolsAdmin />} />
            <Route path="school" element={<AdminSchool />} />
            <Route path="groups" element={<GroupAdmin />} />
            <Route path="group" element={<AdminCourse />} />
            <Route path="courses" element={<CoursesAdmin />} />
            <Route path="teachers" element={<TeacherSchools />} />
            <Route path="students" element={<StudentSchools />} />
          </Route>
        </Route>

        <Route path="/teacher" element={<ExpireToken />}>
          <Route element={<PrivateRoute permittedRole='teacher' />}>
            <Route path="main" element={<TeacherMainPage />} />
            <Route path="main/group/:name/:id" element={<TeacherSelection />} />
            <Route path="main/group/:name/:id/units" element={<TeacherGroupPage />} />
            <Route path="main/group/:name/:id/students" element={<TeacherGroupStudents />} />
            <Route path="main/group/:name/:id/unit/:workUnitId/:workUnitName" element={<TeacherActivitiesPage />} />
            <Route path="main/group/:name/:id/unit/:workUnitId/:workUnitName/:gradeid" element={<TeacherGradesPage />} />
          </Route>
        </Route>

        <Route path="/student" element={<ExpireToken />}>
          <Route element={<PrivateRoute permittedRole="student" />}>
            <Route path="home" element={<Studenthome />} />
            <Route path="workUnit" element={<StudentExercises />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
