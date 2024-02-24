import React from 'react';
import './tag.css';

const Tag = ({ name, color }) => {
  return (
    <div className="Tag" style={{ backgroundColor: color }}>
      <p>{name}</p>
    </div>
  );
};

export default Tag;