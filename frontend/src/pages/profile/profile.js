import ProfileHeader from "../../components/profileheader/profileheader";
import { useRef, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import usersService from '../../services/users.service';
import { Input, Button, notification } from "antd";
import AuthCodeGenerator from "../../components/auth-code-generator/AuthCodeGenerator";
import "./profile.css";
import authService from "../../services/auth.service";
import { errorMessage, noConnectionError } from '../../utils/shared/errorHandler';

const UserProfilePage = () => {
  const passwordRef = useRef(null);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    const passwordValue = passwordRef.current.input.value;
    authService.changePassword({ password: passwordValue }).then((data) => {
      notification.success({
        placement: "top",
        message: 'La contraseña se ha actualizado correctamente',
      });
      setPassword('');
    });
  };

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const tokenDecoded = jwtDecode(token);
      const user = await usersService.getUserById(tokenDecoded.id);
      setUser(user);
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

  return (
    <>
      <ProfileHeader user={user} updateUserInfo={getUserInfo} />
      <div className="main-container">
        <div className="username">{user?.name}</div>
        <div className="floating-container">
          <div className="auth-code-header">Código de autentificación</div>
          <AuthCodeGenerator />
          <form className="form-container" onSubmit={handleChangePassword}>
            <h2>Cambiar contraseña</h2>
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