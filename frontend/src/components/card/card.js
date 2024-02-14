import React, { useState } from 'react';
import './card.css'; 

const Card = ({ title, content, highlightColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="card-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={`card ${isHovered ? 'hovered' : ''}`}>
        <h2>{title}</h2>
        <p>{content}</p>
        {isHovered && <div className="highlight" style={{ backgroundColor: highlightColor }}></div>}
      </div>
    </div>
  );
};

export default Card;
