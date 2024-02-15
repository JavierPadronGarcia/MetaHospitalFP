import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { RolesContext } from './context/roles';
import Login from './pages/login copy/login'
import PrivateRoute from './utils/PrivateRoute';
import authService from './services/auth.service';
import UserAdmin from './pages/useradmin/useradmin';
import GroupAdmin from './pages/groupsadmin/groupsadmin'
import TeacherSchools from './pages/teacherschool/teacherschool'
import AssignTeacherPage from './pages/admin-pages/assign-teacher/AssignTeacherPage';
import AdminDirectorsPage from './pages/admin-pages/admin-directors/AdminDirectorsPage';
import TeacherMainPage from './pages/teacher-pages/teacher-main-page/TeacherMainPage';
import TeacherGroupPage from './pages/teacher-pages/teacher-group-page/TeacherGroupPage';
import TeacherActivitiesPage from './pages/teacher-pages/teacher-activities-page/TeacherActivitiesPage';
import AddActivityPage from './pages/teacher-pages/teacher-add-activity-page/AddActivityPage';
import AdminHome from './pages/admin-pages/adminhome/adminhome';
import SchoolsAdmin from './pages/schooladmin/schooladmin';
import AdminSchool from './pages/adminschool/adminschool';
import StudentSchools from './pages/studentschool/studentschool';
import CoursesAdmin from './pages/coursesadmin/coursesadmin';
import ChatComponent from './components/chat/ChatComponent';
import UserProfilePage from './pages/profile/profile';
import Studenthome from './pages/student-pages/studenthome/studenthome';
import StudentExercises from './pages/student-pages/studentexercises/studentexercises';
import AdminCourse from './pages/admin-pages/admincourse/admincourse';

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
          <Route path="/myUser" element={<UserProfilePage />} />
          <Route path="/chat/:groupId" element={<ChatComponent />} />
        </Route>

        <Route path='/admin' element={<PrivateRoute permittedRole='admin' />}>
          <Route path="control-panel" element={<AdminHome />} />
          <Route path="users" element={<UserAdmin />} />
          <Route path="schools" element={<SchoolsAdmin />} />
          <Route path="school" element={<AdminSchool />} />
          <Route path="groups" element={<GroupAdmin />} />
          <Route path="group" element={<AdminCourse />} />
          <Route path="courses" element={<CoursesAdmin />} />
          <Route path="students" element={<StudentSchools />} />
          <Route path="teachers" element={<TeacherSchools />} />
          <Route path="teachers/assign/:teacher" element={<AssignTeacherPage />} />
          <Route path="directors" element={<AdminDirectorsPage />} />
        </Route>

        <Route path='/teacher' element={<PrivateRoute permittedRole='teacher' />}>
          <Route path="main" element={<TeacherMainPage />} />
          <Route path="main/group/:name/:id" element={<TeacherGroupPage />} />
          <Route path="main/group/:name/:id/unit/:workUnitId/:workUnitName" element={<TeacherActivitiesPage />} />
          <Route path="main/group/:name/:id/unit/:workUnitId/:workUnitName/add" element={<AddActivityPage />} />
        </Route>

        <Route path='/student' element={<PrivateRoute permittedRole='student' />}>
          <Route path="home" element={<Studenthome />} />
          <Route path="workUnit" element={<StudentExercises />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
