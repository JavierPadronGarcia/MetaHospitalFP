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
      const response = await StudentSchoolsService.getStudentsBySchool(
        localStorage.getItem('schoolId')
      );
      const studentList = response.map(student => student.User);
      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error(error.message)
    }
  };

  const getUsers = async () => {
    try {
      const response = await usersService.getStudents();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(error.message)
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
          <List.Item onClick={() => changeName(user.name, user.id)}>
            {user.name}
          </List.Item>
        )}
      />
    </>
  );


  const onDelete = (id) => {
    try {
      getStudents();

      StudentSchoolsService.deleteStudentFromSchool(localStorage.getItem('schoolId'), id);

      getStudents();

      console.log('student deleted successfully');
    } catch (error) {
      console.error('Error delete student:', error);
      message.error(error.message)
    }
  };

  const onSubmit = async () => {
    try {

      if (!userId) {
        console.error('Error: UserId is not defined.');
        return;
      }

      const student = {
        UserId: userId,
      };

      await StudentSchoolsService.createNewStudent(localStorage.getItem('schoolId'), student);

      getStudents();
      console.log('New student created successfully');
    } catch (error) {
      console.error('Error updating/creating student:', error);
      message.error(error.message)
    }
  };

  return (
    <div className='container studentschool-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name="Estudiantes" />
        <BasicList items={students} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} />
        <PopForm renderInputs={renderSchoolImputs} onSubmit={onSubmit} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default StudentSchools;