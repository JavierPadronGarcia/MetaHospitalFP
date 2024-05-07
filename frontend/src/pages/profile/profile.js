import { Button, Input, notification } from "antd";
import dayjs from "dayjs";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from "react";
import ProfileHeader from "../../components/profileheader/profileheader";
import authService from "../../services/auth.service";
import usersService from '../../services/users.service';
import useNotification from '../../utils/shared/errorHandler';
import { useTranslation } from "react-i18next";
import "./profile.css";

const UserProfilePage = () => {
  const [t] = useTranslation('global');
  const { noConnectionError, errorMessage } = useNotification();
  const passwordRef = useRef(null);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();
    const passwordValue = passwordRef.current.input.value;
    authService.changePassword({ password: passwordValue }).then((data) => {
      notification.success({
        placement: "top",
        message: t('successfull_password_update'),
      });
      setPassword('');
    });
  };

  const generateCode = () => {
    usersService.assignCode().then(newCode => {
      getUserInfo();
    });
  };

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const tokenDecoded = jwtDecode(token);
      const newUser = await usersService.getUserById(tokenDecoded.id);
      setUser(newUser);

    } catch (err) {
      if (!err.response) {
        noConnectionError();
      }

      if (err.response && err.code === 500) {
        errorMessage('No se ha podido encontrar su usuario', 'Inténtalo de nuevo');
      }
    }
  };

  return (
    <>
      <ProfileHeader user={user} updateUserInfo={getUserInfo} />
      <div className="main-container">
        <div className="username">{user?.name}</div>
        <div className="floating-container">
          <div className="auth-code-header">{t('auth_code')}</div>
          <div className="auth-code-container">
            {(user && user.code) && <>
              <div>{t('code')}: {user.code}</div>
              {user.codeExpirationDate && <div>{t('expiration')}: {dayjs(user.codeExpirationDate).format('DD-MM-YYYY')}</div>}
            </>}
            {(user && !user.code) && <>
              <div>No hay codigo generado</div>
              <Button onClick={generateCode} type="primary" className="generate-button">Generar codigo</Button>
            </>}
          </div>
          <form className="form-container" onSubmit={handleChangePassword}>
            <h2>{t('change_password')}</h2>
            <div className="input-password">
              <Input.Password
                ref={passwordRef}
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-button">
              <Button htmlType="submit" type="primary" disabled={!password}>
                Confirmar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;