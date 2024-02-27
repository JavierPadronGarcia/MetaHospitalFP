import ProfileHeader from "../../components/profileheader/profileheader";
import { useRef } from "react";
import { Input, Button, notification } from "antd";
import AuthCodeGenerator from "../../components/auth-code-generator/AuthCodeGenerator";
import "./profile.css";
import authService from "../../services/auth.service";

const UserProfilePage = () => {
  const passwordRef = useRef(null);

  const handleChangePassword = (e) => {
    e.preventDefault();
    const passwordValue = passwordRef.current.input.value;
    authService.changePassword({ password: passwordValue }).then((data) => {
      notification.success({
        placement: "top",
        message: 'La contraseña se ha actualizado correctamente',
      });
    });
  };

  return (
    <div>
      <ProfileHeader />
      <div className="main-container">
        <AuthCodeGenerator />
        <form className="form-container" onSubmit={handleChangePassword}>
          <h2>Cambiar constraseña</h2>
          <div className="input-password">
            <label>Contraseña:</label>
            <Input.Password ref={passwordRef} />
          </div>
          <div>
            <Button htmlType="submit" type="primary">
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;