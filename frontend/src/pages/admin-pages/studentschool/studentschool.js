import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import StudentSchoolsService from '../../../services/studentschool.service';
import usersService from '../../../services/users.service';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, List, message } from 'antd';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './studentschool.css';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';

function StudentSchools() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const Headlines = ['Nombre'];
  const location = useLocation();

  const getStudents = async () => {
    try {
      const studentList = await StudentSchoolsService.getStudentsBySchool(
        localStorage.getItem('schoolId')
      );
      setStudents(studentList);
    } catch (error) {
      message.error('No se pudo obtener a los usuarios de la escuela')
    }
  };

  const getUsers = async () => {
    try {
      const response = await usersService.getStudents();
      console.log(response)
      setUsers(response);
    } catch (error) {
      message.error('No se pudo obtener usuarios')
    }
  };

  useEffect(() => {
    getStudents();
    getUsers();
  }, []);

  const filterUsers = (value) => {
    const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(value.toLowerCase()));
    setSearchResults(filteredUsers.slice(0, 3));
  };

  const renderSchoolRow = (student) => (
    <>
      <td>{student.name}</td>
    </>
  );

  const changeName = (name, id) => {
    setName(name);
    setUserId(id);
  }

  const renderSchoolImputs = () => (
    <>
      <h1>{String(Consts.ADD_MODE)}</h1>
      <p>Name</p>
      <Input.Search
        placeholder="Buscar estudiantes"
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
          <List.Item onClick={() => changeName(user.name, user.id)} className='list-item'>
            {user.name}
          </List.Item>
        )}
      />
    </>
  );


  const onDelete = (id) => {
    try {
      console.log(id)
      getStudents();
      StudentSchoolsService.deleteStudentFromSchool(localStorage.getItem('schoolId'), id);
      message.error('Estudiante eliminado correctamente');
      getStudents();
    } catch (error) {
      message.error('No se ha podido eliminar al estudiante');
    }
  };

  const onSubmit = async () => {
    try {

      if (!userId) {
        console.error('Error: UserId is not defined.');
        return;
      }

      const student = {
        studentId: userId,
      };

      await StudentSchoolsService.createNewStudent(localStorage.getItem('schoolId'), student);
      message.success('Estudiante agregado correctamente');
      cancel();
      getStudents();
    } catch (error) {
      message.error('No se ha podido agregar al usuario, intentalo de nuevo');
    }
  };

  const cancel = () => {
    setName('');
  }

  return (
    <div className='container studentschool-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name="Estudiantes" />
        <BasicList items={students} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} />
        <FloatingExcelButton data={students} name='studentReport'></FloatingExcelButton>
        <PopForm renderInputs={renderSchoolImputs} cancel={cancel} onSubmit={onSubmit} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default StudentSchools;
