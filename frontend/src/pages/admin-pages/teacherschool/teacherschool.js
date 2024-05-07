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
import useNotification from '../../../utils/shared/errorHandler';
import SearchComponent from '../../../components/search/search';
import { useTranslation } from 'react-i18next';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';

function TeacherSchools() {
  const [t] = useTranslation('global');
  const {
    noConnectionError,
    schoolTeacherGetError,
    usersGetError,
    userDeleteFailed,
    userDeletedSuccessfully,
    userUpdatedSuccessfully,
    userCreateSuccessful,
    userUpdateOrCreateFail
  } = useNotification();
  const [teacher, setTeacher] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPop, setShowPop] = useState(false);
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [Id, setId] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const Headlines = [t('name_s'), t('email')];
  const location = useLocation();

  const columnTypes = [{
    type: {
      Nombre: 'string',
      Email: 'email',
    }, name: {
      Nombre: 'name',
      Email: 'username',
    }
  }];

  const getTeacher = async () => {
    try {
      const teacherList = await TeacherSchoolsService.getTeachersBySchool(
        localStorage.getItem('schoolId')
      );
      setTeacher(teacherList);
      setFilteredData(teacherList);
    } catch (error) {
      schoolTeacherGetError();
    }
  };

  const getUsers = async () => {
    try {
      const response = await usersService.getTeachers();
      const userList = response;
      setUsers(userList);
    } catch (error) {
      usersGetError();
    }
  };

  useEffect(() => {
    getTeacher();
    getUsers();
    console.log(mode);
  }, []);

  const renderSchoolRow = (teacher) => (
    <>
      <td>{teacher.name}</td>
      <td>{teacher.username}</td>
    </>
  );

  const getTranslation = (mode) => {
    switch (mode) {
      case Consts.ADD_MODE:
        return t('add');
      case Consts.EDIT_MODE:
        return t('edit');
      default:
        return mode;
    }
  }

  const renderSchoolImputs = () => (
    <>
      <h1>{getTranslation(String(mode))}</h1>
      <p>{t('name_s')}</p>
      <Input placeholder={t('name_s')}
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <p>{t('email')}</p>
      <Input placeholder={t('email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)} />
    </>
  );

  const onDelete = async (id) => {
    try {
      await usersService.deleteUser(id);
      userDeletedSuccessfully();
      getTeacher();
      getUsers();
    } catch (error) {
      console.error(error)
      userDeleteFailed();
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
        throw new Error(t('fill_all_fields'));
      }

      if (mode === Consts.EDIT_MODE) {

        await usersService.updateUserWithoutImage(email, Id, 'teacher', name, localStorage.getItem('schoolId'));

        userUpdatedSuccessfully();
        cleanInputs();
        setMode(Consts.ADD_MODE);
        getTeacher();
        getUsers();
      } else {

        await usersService.createNewUser({ name: name, role: 'teacher', schoolId: localStorage.getItem('schoolId') }, email);

        cleanInputs();
        userCreateSuccessful();
        getTeacher();
        getUsers();
      }
    } catch (error) {

      if (error.message === 'Network Error') {
        noConnectionError();
      } else if (error.message === 'Rellena todos los campos') {
        message.error(t('fill_all_fields'));
      } else {
        userUpdateOrCreateFail();
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
        <Tag name={t('teacher_p')} />
        <SearchComponent data={teacher} onSearch={handleSearch} fieldName="name" />
        <BasicList items={filteredData} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit} columnTypes={columnTypes} />
        <FloatingExcelButton data={teacher} name={`profesores - ${localStorage.getItem('schoolName')}`} />
        <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={{ editMode: mode === Consts.EDIT_MODE, showPop: showPop }} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default TeacherSchools;
