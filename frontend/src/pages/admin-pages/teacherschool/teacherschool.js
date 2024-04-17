import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import TeacherSchoolsService from '../../../services/teacherschool.service';
import usersService from '../../../services/users.service';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, message } from 'antd';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './teacherschool.css';
import { noConnectionError } from '../../../utils/shared/errorHandler';
import SearchComponent from '../../../components/search/search';

function TeacherSchools() {
  const [teacher, setTeacher] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPop, setShowPop] = useState(false);
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [Id, setId] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const Headlines = ['Nombre'];
  const location = useLocation();

  const getTeacher = async () => {
    try {
      const teacherList = await TeacherSchoolsService.getTeachersBySchool(
        localStorage.getItem('schoolId')
      );
      setTeacher(teacherList);
      setFilteredData(teacherList)
    } catch (error) {
      message.error('No se pudo obtener a los profesores de la escuela');
    }
  };

  const getUsers = async () => {
    try {
      const response = await usersService.getTeachers();
      const userList = response;
      setUsers(userList);
    } catch (error) {
      message.error('No se pudo obtener a los usuarios')
    }
  };

  useEffect(() => {
    getTeacher();
    getUsers();
  }, []);

  const renderSchoolRow = (teacher) => (
    <>
      <td>{teacher.name}</td>
      <td>{teacher.username}</td>
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
      getTeacher();
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

        await usersService.updateUserWithoutImage(email, Id, 'teacher', name, localStorage.getItem('schoolId'));

        message.success('Usuario actualizado correctamente');
        cleanInputs();
        setMode(Consts.ADD_MODE);
        getTeacher();
        getUsers();
      } else {

        await usersService.createNewUser({ name: name, role: 'teacher', schoolId: localStorage.getItem('schoolId') }, email);

        cleanInputs();
        message.success('Usuario creado correctamente');
        getTeacher();
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
    <div className='container teacherschool-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name="Profesores" />
        <SearchComponent data={teacher} onSearch={handleSearch} fieldName="name"/>
        <BasicList items={filteredData} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}/>
        <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={{ editMode: mode === Consts.EDIT_MODE, showPop: showPop }} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default TeacherSchools;
