import './ViewsSelector.css';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ViewsSelector = ({ selectedView, onViewChange, children }) => {

  const [t] = useTranslation('global');

  const handleViewChange = (view) => {
    onViewChange(view);
  }

  return (
    <div className='views-selector'>
      <div className='views-selector-title'>
        {t('view_s')}
      </div>
      <div className='views-selector-items'>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            className: (child.props.view === selectedView) ? 'views-selector-item selected' : 'views-selector-item',
            onClick: () => handleViewChange(child.props.view)
          });
        })}
      </div>

    </div>
  );
}

export default ViewsSelector;