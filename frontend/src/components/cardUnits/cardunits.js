import React, { useState } from 'react';
import './cardunits.css'; 

const CardUnits = ({ title, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="cardunits-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='cardunits'>
        <div className="scuare" style={{backgroundColor : color}}></div>
        <div className="content">
          <h2>{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default CardUnits;

