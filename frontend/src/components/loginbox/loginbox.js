import { useContext, useEffect, useState } from 'react';
import './loginbox.css';
import useNotification from '../../utils/shared/errorHandler';
import { Button, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import { RolesContext } from '../../context/roles';
import { loginValidation } from '../../utils/shared/globalFunctions';
import subscriptionMiddleware from '../../utils/subscriptionMiddleware';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

function LoginBox() {
  const { noConnectionError, errorOnLogin} = useNotification();
  const [t, i18n] = useTranslation('global');
  const roles = useContext(RolesContext);
  const navigate = useNavigate();

  const logged = authService.isLoggedIn();

  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [inputNameStatus, setInputNameStatus] = useState('');
  const [inputPasswdStatus, setInputPasswdStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (username, password) => {
    authService.login({ username: username, password: password }).then((user) => {

      if (user.role === 'student') {
        subscriptionMiddleware(user);
      }

      roles.role = user.role;

      message.success({
        content: t('successfull_login'),
        duration: 1,
      })
      if (user.schoolId) {
        authService.navigateToSchool(user, navigate);
      } else {
        authService.navigateByRole(user.role, navigate);
      }

      setLoading(false);
    }).catch((err) => {
      loginErrors(err);
      setLoading(false);
    })
  }

  const loginErrors = (err) => {
    if (!err.response) {
      noConnectionError();
    }

    if (err.response &&
      (err.response.status === 401
        || err.response.status === 500)) {
      errorOnLogin();
    }
  }

  const login = (e) => {
    e.preventDefault();
    setLoading(true);
    const username = userName;
    const password = userPassword;

    setInputNameStatus('');
    setInputPasswdStatus('');

    notification.destroy();

    const isLoginValid = loginValidation(
      username, password,
      setInputNameStatus,
      setInputPasswdStatus,
      setLoading
    );

    if (isLoginValid) {
      handleLogin(username, password);
    }
  }

  useEffect(() => {
    if (logged) {
      authService.navigateByRole(roles.role, navigate);
    }
  }, [])

  return (
    // <div className='login-content'>
    //   <div className='box'>
    //     <div className='box-left'>
    //       <img src='/assets/imgs/Medicine.svg' alt="medicine" />
    //     </div>
    //     <div className='box-right'>
    //       <div className='logo'>
    //         <img src='/assets/imgs/Icon.png' alt="My logo" />
    //         <h1>MetaHospitalFp</h1>
    //       </div>
    //       <form className='inputs' onSubmit={login}>
    //         <Input
    //           className='input'
    //           status={inputNameStatus}
    //           name="user"
    //           id="user"
    //           onChange={(e) => setUserName(e.target.value)}
    //           placeholder="Usuario"
    //         />
    //         <Input.Password
    //           className='input'
    //           status={inputPasswdStatus}
    //           name="password"
    //           id="password"
    //           onChange={(e) => setUserPassword(e.target.value)}
    //           placeholder="Contraseña"
    //         />
    //         <Button className='button-login' htmlType='submit' loading={loading}>Iniciar sesion</Button>
    //         <a href="/Help/MetaHospital - Documentación de Gestión de Centros y Administración.html">Ayuda</a>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <div className='main-page'>
      <div className="login-page">
        <div>
          <header className='login-page-header'>
            <div><img src='/assets/imgs/Icon.png' alt="My logo" /></div>
            <h1>MetaHospitalFP</h1>
          </header>
          <main className='login-page-main'>
            <form onSubmit={(e) => login(e)}>
              <div>
                <label className="input-label">
                  <Input
                    status={inputNameStatus}
                    name="user"
                    id="user"
                    placeholder={t('user_s')}
                    prefix={<UserOutlined />}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </label>
                <label className="input-label">
                  <Input.Password
                    status={inputPasswdStatus}
                    name="password"
                    id="password"
                    placeholder={t('password')}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                </label>
              </div>
              <label className='buttons-container'>
                <Button className='button' htmlType='submit' loading={loading}>{t('login')}</Button>
                <a href="/assets/help/Iniciodesesion.html">{t('help')}</a>
              </label>
            </form>
          </main>
        </div>
        <footer className='login-page-footer'>
          <img src='/assets/imgs/Medicine.svg' alt="medicine" />
        </footer>
      </div>
    </div>
  );
}

export default LoginBox;
