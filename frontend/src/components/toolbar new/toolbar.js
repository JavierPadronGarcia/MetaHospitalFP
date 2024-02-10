import './Toolbar.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import { useContext, useState } from 'react';
import { RolesContext } from '../../context/roles';

function Toolbar() {

  const navigate = useNavigate();
  const RoleContext = useContext(RolesContext);
  const [openConfirmLogout, setContifmLogout] = useState(false);

  const handleLogOut = () => {
    RoleContext.role = '';
    authService.logout().then(() => {
      navigate('/');
    });
  }

  return (
    <footer className="footer">
      <div className='toolbar-rigth'>
      <UserOutlined />
      </div>
      <div className='toolbar-left'>
        <HomeOutlined />
      </div>
    </footer>
  );
}

export default Toolbar;