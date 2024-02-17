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

  return (
    <div className="square" onClick={handleClick}>
      <img src={icon} alt={label} />
      <p>{label}</p>
    </div>
  );
};

export default Square