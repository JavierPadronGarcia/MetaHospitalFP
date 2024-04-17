import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import usersService from '../../../services/users.service';
import schoolService from '../../../services/schools.service'
import Menu from '../../../components/menu/menu';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, Select, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { Link, useLocation } from 'react-router-dom';
import './useradmin.css';
import { noConnectionError } from '../../../utils/shared/errorHandler';
import SearchComponent from '../../../components/search/search';

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [Id, setId] = useState('');
  const [role, setRole] = useState('student');
  const Headlines = ['Imagen', 'Nombre', 'Email', 'Escuela', 'Identificador'];
  const [schoolId, setSchoolId] = useState();
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [showPop, setShowPop] = useState(false);
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);

  const { Option } = Select;

  useEffect(() => {
    getUsers();
    getSchools();
  }, []);

  const optionRole = [
    { value: 'student', label: 'Estudiante' },
    { value: 'Admin', label: 'Admin' },
    { value: 'teacher', label: 'Profesor' },
  ];

  const handleChange = (value) => {
    setRole(value);
  };

  const getUsers = async () => {
    try {
      const response = await usersService.getUsers();
      const userList = response;
      setUsers(userList);
      setFilteredData(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(error.message)
    }
  };

  const getSchools = async () => {
    try {
      const schoolsResponse = await schoolService.getSchools();
      setSchools(schoolsResponse);
      console.log(schoolsResponse);
    } catch (err) {
      console.log("Error fetching schools:", err);
    }
  }

  const navigateSchool = (id, name) => {
    localStorage.setItem('schoolId', id);
    localStorage.setItem('schoolName', name)
  }

  const getSchoolsname = (id) => {
    const school = schools.find(school => school.id === id);
    return school ? school.name : '---';
  }

  const renderUserRow = (user) => (
    <>
      <td><Avatar shape="square" size={64} icon={<UserOutlined />}
        src={`${process.env.REACT_APP_BACKEND_URL}/images/${user.filename}`} alt="avatar" /></td>
      <td>{user.name}</td>
      <td>{user.username}</td>
      {user.schoolId ? (
        <td>
          <Link onClick={() => navigateSchool(user.schoolId, user.schoolName)} to='/admin/school'>
            {user.schoolName}
          </Link>
        </td>
      ) : user.Admin && user.Admin.SchoolID ? (
        <td>
          <Link onClick={() => navigateSchool(user.Admin.SchoolID, user.schoolName)} to='/admin/school'>
            {getSchoolsname(user.Admin.SchoolID)}
          </Link>
        </td>
      ) : (
        <td>---</td>
      )}
      <td>{user.role}</td>
    </>
  );

  const handleSchoolChange = (value) => {
    setSelectedSchool(value);
  }

  const renderUserImputs = () => (
    <>
      <h1>{String(mode)}</h1>
      <p>Name</p>
      <Input placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <p>Email</p>
      <Input placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <p>Role</p>
      <Select
        defaultValue="Estudiante"
        value={role}
        options={optionRole}
        onChange={handleChange} />
      <p>School</p>
      <Select
        placeholder="Select School"
        value={selectedSchool}
        onChange={handleSchoolChange}
      >
        <Option value="">Select School</Option>
        {schools.map(school => (
          <Option key={school.id} value={school.id}>{school.name}</Option>
        ))}
      </Select>
    </>
  );

  const onDelete = async (id) => {
    try {
      await usersService.deleteUser(id);
      message.success("Usuario eliminado correctamente");
      getUsers();
    } catch (error) {
      console.error(error)
      message.error('Error al eliminar al usuario')
    }
  }

  const Edit = (id, editType) => {
    const userToEdit = users.find(user => user.id === id);

    setId(id);

    if (editType === 'popform') {
      setShowPop(true);
    } else {
      setShowPop(false);
    }

    setName(userToEdit.name);
    setEmail(userToEdit.username);
    setRole(userToEdit.role);
    setMode(Consts.EDIT_MODE);
    setSelectedSchool(userToEdit.schoolId);
  }

  const onSubmit = async () => {
    try {

      if (!name || !role || !email) {
        throw new Error('Rellena todos los campos');
      }

      if ((role === 'student' && selectedSchool === '')||(role === 'teacher' && selectedSchool === '')) {
        throw new Error('Es necesario para estudiantes como profesores seleccionar Escuela')
      }

      if (mode === Consts.EDIT_MODE) {

        await usersService.updateUserWithoutImage(email, Id, role, name, selectedSchool);

        message.success('Usuario actualizado correctamente');
        cleanInputs();
        setMode(Consts.ADD_MODE);
        getUsers();
      } else {

        await usersService.createNewUser({ name: name, role: role, schoolId: selectedSchool }, email);

        cleanInputs();
        message.success('Usuario creado correctamente');
        getUsers();
      }
    } catch (error) {

      if (error.message === 'Network Error') {
        noConnectionError();
      } else if (error.message === 'Rellena todos los campos') {
        message.error(error.message);
      } else if (error.message === 'Es necesario para estudiantes como profesores seleccionar Escuela') {
        message.error(error.message);
      }else {
        message.error('No se ha podido crear/actualizar el usuario');
      }
    }
  }

  const cleanInputs = () => {
    setEmail('');
    setName('');
    setRole('student');
    setSelectedSchool('');
  }

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
    setName('');
    setEmail('');
    setRole('Estudiante');
    setSelectedSchool('');
  }

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className='container useradmin-page'>
      <div className='container-left'>
        <Menu />
        <Tag name="Usuarios" />
        <SearchComponent data={users} onSearch={handleSearch} fieldName="name"/>
        <BasicList items={filteredData} renderRow={renderUserRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
        <PopForm renderInputs={renderUserImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={{ editMode: mode === Consts.EDIT_MODE, showPop: showPop }} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderUserImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );

}

export default UserAdmin;