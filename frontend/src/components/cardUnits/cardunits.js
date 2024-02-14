import React, { useState } from 'react';
import './cardunits.css';
import { useNavigate } from 'react-router-dom';

const CardUnits = ({ title, color, route, workUnit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = () => {
    if (workUnit) localStorage.setItem('actualWorkUnit', JSON.stringify(workUnit));
    navigate(route);
  }

  return (
    <div className="cardunits-container" onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='cardunits'>
        <div className="scuare" style={{ backgroundColor: color }}></div>
        <div className="content">
          <h2>{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default CardUnits;

