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
import useNotification from '../../../utils/shared/errorHandler';
import SearchComponent from '../../../components/search/search';
import { useTranslation } from 'react-i18next';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';

function UserAdmin() {
  const { noConnectionError } = useNotification();
  const [t] = useTranslation('global');
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [Id, setId] = useState('');
  const [role, setRole] = useState('student');
  const Headlines = [t('image'), t('name_s'), t('email'), t('school_s'), t('role_s')];

  const columnTypes = [{
    type: {
      1: 'image',
      2: 'string',
      3: 'string',
      4: 'string',
      5: 'string'
    }, name: {
      1: 'filename',
      2: 'name',
      3: 'username',
      4: 'schoolName',
      5: 'role'
    }
  }];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [showPop, setShowPop] = useState(false);
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);

  const { Option } = Select;

  const filter = [
    { name: t('name_s'), value: 'name' },
    { name: t('email'), value: 'username' },
    { name: t('school_s'), value: 'schoolName' },
    { name: t('role_s'), value: 'role' },
  ];

  useEffect(() => {
    getUsers();
    getSchools();
  }, []);

  const optionRole = [
    { value: 'student', label: t('student_s') },
    { value: 'Admin', label: t('admin_s') },
    { value: 'teacher', label: t('teacher_s') },
  ];

  const handleChange = (value) => {
    setRole(value);
  };

  const getUsers = async () => {
    try {
      const response = await usersService.getUsers();
      const userList = response.map((user => {
        switch (user.role) {
          case 'admin':
            user.role = t('admin_s');
            break;
          case 'teacher':
            user.role = t('teacher_s');
            break;
          case 'student':
            user.role = t('student_s');
            break;
          default:
            break;
        }
        return user;
      }));
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

  const renderUserImputs = () => (
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
      <p>Role</p>
      <Select
        defaultValue={t('student_s')}
        value={role}
        options={optionRole}
        onChange={handleChange} />
      <p>{t('school_s')}</p>
      <Select
        placeholder={t('select_school')}
        value={selectedSchool}
        onChange={handleSchoolChange}
      >
        <Option value="">{t('select_school')}</Option>
        {schools.map(school => (
          <Option key={school.id} value={school.id}>{school.name}</Option>
        ))}
      </Select>
    </>
  );

  const onDelete = async (id) => {
    try {
      await usersService.deleteUser(id);
      message.success(t('user_delete_successfull'));
      getUsers();
    } catch (error) {
      console.error(error)
      message.error(t('user_delete_failed'))
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
        throw new Error(t('fill_all_fields'));
      }

      if ((role === 'student' && selectedSchool === '') || (role === 'teacher' && selectedSchool === '')) {
        throw new Error(t('school_required_1'))
      }

      if (mode === Consts.EDIT_MODE) {

        await usersService.updateUserWithoutImage(email, Id, role, name, selectedSchool);

        message.success(t('user_update_successfull'));
        cleanInputs();
        setMode(Consts.ADD_MODE);
        getUsers();
      } else {

        await usersService.createNewUser({ name: name, role: role, schoolId: selectedSchool }, email);

        cleanInputs();
        message.success(t('user_create_successfull'));
        getUsers();
      }
    } catch (error) {

      if (error.message === 'Network Error') {
        noConnectionError();
      } else if (error.message === 'Rellena todos los campos') {
        message.error(t('fill_all_fields'));
      } else if (error.message === 'Es necesario para estudiantes como profesores seleccionar Escuela') {
        message.error(t('school_required_1'));
      } else {
        message.error(t('user_update_create_fail'));
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
    setRole('student');
    setSelectedSchool('');
  }

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className='container useradmin-page'>
      <div className='container-left'>
        <Menu />
        <Tag name={t('user_p')} />
        <SearchComponent data={users} onSearch={handleSearch} fieldName="name"  filter={filter} />
        <BasicList items={filteredData} renderRow={renderUserRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit} columnTypes={columnTypes}></BasicList>
        <FloatingExcelButton data={users} name={'usuarios'} />
        <PopForm renderInputs={renderUserImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={{ editMode: mode === Consts.EDIT_MODE, showPop: showPop }} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderUserImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );

}

export default UserAdmin;