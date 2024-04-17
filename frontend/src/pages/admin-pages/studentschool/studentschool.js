import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import StudentSchoolsService from '../../../services/studentschool.service';
import usersService from '../../../services/users.service';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, message } from 'antd';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './studentschool.css';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';
import { noConnectionError } from '../../../utils/shared/errorHandler';
import SearchComponent from '../../../components/search/search';

function StudentSchools() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [Id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPop, setShowPop] = useState(false);
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const Headlines = ['Nombre','Email'];
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);

  const getStudents = async () => {
    try {
      const studentList = await StudentSchoolsService.getStudentsBySchool(
        localStorage.getItem('schoolId')
      );
      setStudents(studentList);
      setFilteredData(studentList)
    } catch (error) {
      message.error('No se pudo obtener a los usuarios de la escuela')
    }
  };

  const getUsers = async () => {
    try {
      const response = await usersService.getUsers();
      const userList = response;
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(error.message)
    }
  };

  useEffect(() => {
    getStudents();
    getUsers();
  }, []);

  const renderSchoolRow = (student) => (
    <>
      <td>{student.name}</td>
      <td>{student.username}</td>
    </>
  );

  const renderSchoolImputs = () => (
    <>
      <h1>{String(Consts.ADD_MODE)}</h1>
      <p>Name</p>
      <Input placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <p>Email</p>
      <Input placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} />
    </>
  );

  const onDelete = async (id) => {
    try {
      await usersService.deleteUser(id);
      message.success("Usuario eliminado correctamente");
      getStudents();
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
    setMode(Consts.EDIT_MODE);
  }

  const onSubmit = async () => {
    try {

      if (!name || !email) {
        throw new Error('Rellena todos los campos');
      }

      if (mode === Consts.EDIT_MODE) {

        await usersService.updateUserWithoutImage(email, Id, 'student', name, localStorage.getItem('schoolId'));

        message.success('Usuario actualizado correctamente');
        cleanInputs();
        setMode(Consts.ADD_MODE);
        getStudents();
        getUsers();
      } else {

        await usersService.createNewUser({ name: name, role: 'student', schoolId: localStorage.getItem('schoolId') }, email);

        cleanInputs();
        message.success('Usuario creado correctamente');
        getStudents();
        getUsers();
      }
    } catch (error) {

      if (error.message === 'Network Error') {
        noConnectionError();
      } else if (error.message === 'Rellena todos los campos') {
        message.error(error.message);
      } else {
        message.error('No se ha podido crear/actualizar el usuario');
      }
    }
  }

  const cleanInputs = () => {
    setEmail('');
    setName('');
  }

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
    setName('');
    setEmail('');
  }

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className='container studentschool-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name="Estudiantes" />
        <SearchComponent data={students} onSearch={handleSearch} fieldName="name"/>
        <BasicList items={filteredData} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}/>
        <FloatingExcelButton data={students}></FloatingExcelButton>
        <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={{ editMode: mode === Consts.EDIT_MODE, showPop: showPop }} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default StudentSchools;
