import React from 'react';
import './rightmenu.css';
import { Button } from 'antd';
import { Consts } from '../../constants/modes';
import { useTranslation } from 'react-i18next';

const Rightmenu = ({ renderImputs, cancel, mode, onSubmit, currentRoute }) => {

  const [t, i18n] = useTranslation('global');

  const selectIcon = () => {
    let icon = '';
    switch (currentRoute) {
      case '/admin/control-panel':
        icon = '/assets/imgs/Medicine.svg';
        break;
      case '/admin/users':
        icon = '/assets/imgs/users2.svg';
        break;
      case '/admin/schools':
        icon = '/assets/imgs/schools2.svg';
        break;
      case '/admin/school':
        icon = '/assets/imgs/schools2.svg';
        break;
      case '/admin/students':
        icon = '/assets/imgs/students.svg';
        break;
      case '/admin/teachers':
        icon = '/assets/imgs/teachers2.svg';
        break;
      case '/admin/courses':
        icon = '/assets/imgs/courses2.svg';
        break;
    }
    return icon;
  };

  const shouldRenderContent = renderImputs && onSubmit;

  return (
    <div className="right_menu">
      {shouldRenderContent && (
        <div className="inputs">
          {renderImputs()}
          <div className='buttons'>
            <Button className='submit-button' onClick={onSubmit}>{t('send')}</Button>
            {mode !== Consts.ADD_MODE && mode && cancel && (
              <Button danger onClick={cancel}>
                {t('cancel')}
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
