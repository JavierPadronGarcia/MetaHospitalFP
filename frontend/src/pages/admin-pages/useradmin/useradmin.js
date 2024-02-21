import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import usersService from '../../../services/users.service';
import Menu from '../../../components/menu/menu';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, Select, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import FloatingMenu from '../../../components/FloatingMenu/FloatingMenu';
import { useLocation } from 'react-router-dom';
import './useradmin.css';

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [Id, setId] = useState('');
  const [role, setRole] = useState('student');
  const Headlines = ['Imagen', 'Nombre', 'Email', 'Identificador'];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const location = useLocation();

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
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(error.message)
    }
  };


  useEffect(() => {
    getUsers();
  }, []);


  const renderUserRow = (user) => (
    <>
      <td><Avatar shape="square" size={64} icon={<UserOutlined />}
        src={`${process.env.REACT_APP_BACKEND_URL}/images/${user.filename}`} alt="avatar" /></td>
      <td>{user.name}</td>
      <td>{user.username}</td>
      <td>{user.role}</td>
    </>
  );

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
    </>
  );

  const onDelete = async (id) => {
    try {
      await usersService.deleteUser(id);
      console.log('Users deleted successfully');
      getUsers();
    } catch (error) {
      console.error('Error delete user:', error);
      message.error(error.message)
    }
  }

  const Edit = (id) => {
    const userToEdit = users.find(user => user.id === id);

    setId(id);

    setName(userToEdit.name);
    setEmail(userToEdit.username);
    setRole(userToEdit.role);
    setMode(Consts.EDIT_MODE);
  }

  const onSubmit = async () => {
    try {
      if (mode === Consts.EDIT_MODE) {
        const userToEdit = users.find(user => user.id === Id);

        userToEdit.name = name;
        userToEdit.usrname = email;
        userToEdit.role = role;

        await usersService.updateUserWithoutImage(email, Id, role, name);

        console.log('Users updated successfully');
        message.success('Users updated successfully')
        getUsers();
      } else {

        const potUser = {
          name: name,
          role: role,
        };
        console.log(role);

        await usersService.createNewUser(potUser, email);

        console.log('New user created successfully');
        message.success('New user created successfully')
        getUsers();
      }
    } catch (error) {
      console.error('Error updating/creating user:', error);
      message.error(error.message)
    }
  }

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
    setName('');
    setEmail('');
    setRole('Estudiante');
  }

  return (
    <div className='container useradmin-page'>
      <div className='container-left'>
        <Menu />
        <Tag name="Usuarios" />
        <BasicList items={users} renderRow={renderUserRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
        <FloatingMenu />
        <PopForm renderInputs={renderUserImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={mode === Consts.EDIT_MODE} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderUserImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );

}

export default UserAdmin;