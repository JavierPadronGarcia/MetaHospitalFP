import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import TeacherSchoolsService from '../../../services/teacherschool.service';
import usersService from '../../../services/users.service';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, List, message } from 'antd';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './teacherschool.css';

function TeacherSchools() {
  const [teacher, setTeacher] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const Headlines = ['Nombre'];
  const location = useLocation();

  const getTeacher = async () => {
    try {
      const response = await TeacherSchoolsService.getTeachersBySchool(
        localStorage.getItem('schoolId')
      );
      const teacherList = response.map(teacher => teacher);
      setTeacher(teacherList);
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

  const filterUsers = (value) => {
    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));
    setSearchResults(filteredUsers.slice(0, 3));
  };

  const renderSchoolRow = (teacher) => (
    <>
      <td>{teacher.name}</td>
    </>
  );

  const changeName = (name, id) => {
    setName(name);
    setUserId(id);
    console.log(id);
  }

  const renderSchoolImputs = () => (
    <>
      <h1>{String(Consts.ADD_MODE)}</h1>
      <p>Name</p>
      <Input.Search
        placeholder="Buscar profesor"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          filterUsers(e.target.value);
        }}
      />
      <List
        bordered
        dataSource={searchResults}
        renderItem={(user) => (
          <List.Item onClick={() => changeName(user.name, user.id)}>
            {user.name}
          </List.Item>
        )}
      />
    </>
  );


  const onDelete = async (id) => {
    try {
      getTeacher();
      TeacherSchoolsService.deleteTeacherFromSchool(localStorage.getItem('schoolId'), id);
      getTeacher();

      message.success('Profesor eliminado de la escuela correctamente');
    } catch (error) {
      message.success('No se pudo eliminar al profesor de la escuela');
    }
  };

  const onSubmit = async () => {
    try {

      if (!userId) {
        console.error('Error: UserId is not defined.');
        return;
      }

      const teacher = {
        UserId: userId,
      };

      await TeacherSchoolsService.createNewTeacher(localStorage.getItem('schoolId'), teacher);

      getTeacher();
      message.success('Profesor agregado a la escuela correctamente');
    } catch (error) {
      message.success('No se pudo agregar al profesor a la escuela');
    }
  };

  const cancel = () => {
    setName('');
  }

  return (
    <div className='container teacherschool-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name="Profesores" />
        <BasicList items={teacher} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} />
        <PopForm renderInputs={renderSchoolImputs} cancel={cancel} onSubmit={onSubmit} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default TeacherSchools;
