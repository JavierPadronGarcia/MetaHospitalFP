import React from 'react';
import './tag.css';

const Tag = ({ name, color, leftButton, rightButton }) => {
  return (
    <div className="Tag" style={{ backgroundColor: color }}>
      <p>{name}</p>
      <div className='Tag-buttons'>
        {leftButton && (leftButton())}
        {rightButton && (rightButton())}
      </div>
    </div>
  );
};

export default Tag;