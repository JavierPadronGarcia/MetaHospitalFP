import React from 'react';
import './cardunits.css';
import { useNavigate } from 'react-router-dom';

const CardUnits = ({ title, color, route, workUnit, date }) => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    if (workUnit) localStorage.setItem('actualWorkUnit', JSON.stringify(workUnit));
    navigate(route);
  }

  return (
    <div className="cardunits-container">
      <div className='cardunits' onClick={handleNavigate}>
        <div className="square" style={{ backgroundColor: color }}></div>
        <div className="content">
          <div style={{color: '#777777'}}>{title}</div>
          <div className='date' style={{color: '#777777'}}>{date}</div>
        </div>
      </div>
    </div>
  );
};

export default CardUnits;

