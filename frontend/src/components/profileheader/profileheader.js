import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Upload, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import './profileheader.css';
import { RolesContext } from '../../context/roles';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import usersService from '../../services/users.service';
import { errorMessage, noConnectionError } from '../../utils/shared/errorHandler';
import { backendImageEndpoint } from '../../constants/backendEndpoints';
import AuthCodeGenerator from '../auth-code-generator/AuthCodeGenerator'

const ProfileHeader = () => {
  const RoleContext = useContext(RolesContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const tokenDecoded = jwtDecode(token);
      const user = await usersService.getUserById(tokenDecoded.id);
      setUser(user);
      setUserName(user.name);
      setUserImage(user.filename || '');
    } catch (err) {
      if (!err.response) {
        noConnectionError();
      }

      if (err.response && err.code === 500) {
        errorMessage('No se ha podido encontrar su usuario', 'Inténtalo de nuevo');
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleUpdateUser = async (options) => {
    const prevFilename = user.filename === '' ? null : user.filename;
    const { file } = options;
    const imageBlob = file.originFileObj;
    const response = await fetch(URL.createObjectURL(imageBlob));
    const blob = await response.blob();

    message.loading('Actualizando...', 0);
    try {
      if (blob) {
        await usersService.updateUserWithImage(null, blob, prevFilename);
        message.destroy();
        message.success('Imagen actualizada correctamente');
      }

      getUserInfo();
    } catch (err) {
      handleError(err);
    } finally {
      message.destroy();
    }
  };

  const handleError = (err) => {
    if (!err.response) {
      noConnectionError();
    }
  };

  const handleLogOut = () => {
    RoleContext.setRole('');
    authService.logout().then(() => {
      navigate('/');
    });
  };

  return (
    <div className="profile-header">
      <div className="avatar-container">
        <Upload
          showUploadList={false}
          onChange={handleUpdateUser}
        >
          {userImage ? (
            <Avatar
              icon={<img src={`${backendImageEndpoint}/${user.filename}`} alt={`imagen del usuario ${user && user.username}`} />}
              size={100}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <Avatar
              icon={<UserOutlined />}
              size={100}
              style={{ cursor: 'pointer' }}
            />
          )}
        </Upload>
        <div className="username">{userName}</div>
      </div>
      <div className="actions">
        <a onClick={handleLogOut} >Cerrar sesión</a>
      </div>
    </div>
  );
};

export default ProfileHeader;
