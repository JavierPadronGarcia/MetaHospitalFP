import React from 'react';
import './tag.css';

const Tag = ({ name }) => {
  return (
    <div className="Tag">
      <p>{name}</p>
    </div>
  );
};

export default Tag;