import React, { useContext, useState } from 'react';
import { Avatar, Upload, message } from 'antd';
import { LeftOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import './profileheader.css';
import { RolesContext } from '../../context/roles';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import usersService from '../../services/users.service';
import useNotification from '../../utils/shared/errorHandler';
import { backendImageEndpoint } from '../../constants/backendEndpoints';
import { t } from 'i18next';

const ProfileHeader = ({ user, updateUserInfo }) => {
  const { noConnectionError } = useNotification();
  const RoleContext = useContext(RolesContext);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateUser = async (options) => {
    if (isUploading) return;
    setIsUploading(true);
    const { file } = options;

    if (file) {
      const prevFilename = user.filename === '' ? null : user.filename;
      const imageBlob = file.originFileObj;
      const response = await fetch(URL.createObjectURL(imageBlob));
      const blob = await response.blob();

      message.loading(`${t('updating')}...`, 0);
      try {
        if (blob) {
          await usersService.updateUserWithImage(null, blob, prevFilename);
          message.destroy();
          message.success(t('image_update_successful'));
        }
        updateUserInfo();
      } catch (err) {
        handleError(err);
      } finally {
        setIsUploading(false);
        message.destroy();
      }
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
          {user?.filename != '' && user?.filename != null ? (
            <Avatar
              icon={<img src={`${backendImageEndpoint}/${user.filename}`} alt={`${t('user_image').replace('_', user.username ?? '')}`} />}
              className="user-avatar"
            />
          ) : (
            <Avatar
              icon={<UserOutlined />}
              className="user-avatar"
            />
          )}
        </Upload>
      </div>
      <div className='go-back'>
        <LeftOutlined onClick={() => navigate(-1)} >{t('go_back')}</LeftOutlined>
      </div>
      <div className="actions">
        <LogoutOutlined onClick={handleLogOut} >{t('logout')}</LogoutOutlined>
      </div>
    </div>
  );
};

export default ProfileHeader;
