import React from "react";
import './square.css'
import { useNavigate } from 'react-router-dom';

const Square = ({ icon, label, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && route) {
      navigate(route);
    }
  };

  return (
    <div className="square" tabindex="0" onClick={handleClick} onKeyDown={handleKeyDown}>
      <img src={icon} alt={label} />
      <p>{label}</p>
    </div>
  );
};

export default Square