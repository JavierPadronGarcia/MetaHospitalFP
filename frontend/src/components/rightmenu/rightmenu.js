import React from 'react';
import './rightmenu.css';
import Medicine from '../../imgs/Medicine.svg';
import users from '../../imgs/users2.svg';
import schools from '../../imgs/schools2.svg';
import students from '../../imgs/students.svg';
import teacher from '../../imgs/teachers2.svg';
import courses from '../../imgs/courses2.svg';
import { Button } from 'antd';
import Consts from '../consts/consts';


const Rightmenu = ({ renderImputs, cancel, mode, onSubmit,currentRoute }) => {

  const selectIcon = () => {
    if (currentRoute === '/admin/control-panel') {
      return Medicine;
    } else if (currentRoute === '/admin/users') {
      return users;
    }else if (currentRoute === '/admin/schools') {
      return schools;
    }else if (currentRoute === '/admin/school') {
      return schools;
    }else if (currentRoute === '/admin/students') {
      return students;
    }else if (currentRoute === '/admin/teachers') {
      return teacher;
    }else if (currentRoute === '/coursesadmin') {
      return courses;
    }
    return null;
  };
  
  const shouldRenderContent = renderImputs && onSubmit;

  return (
    <div className="right_menu">
      {shouldRenderContent && (
        <div className="inputs">
          {renderImputs()}
          <div className='buttons'>
            <Button className='submit-button' onClick={onSubmit}>Enviar</Button>
            {mode !== Consts.ADD_MODE && mode && cancel && (
              <Button danger onClick={cancel}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      )}
      <img src={selectIcon()} alt="decoration" className="photo" />
    </div>
  );
};


export default Rightmenu;
