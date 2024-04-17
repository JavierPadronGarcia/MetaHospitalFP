import React, { useState } from 'react';
import './card.css';

const Card = ({ title, content, highlightColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="card-container">
      <div className={`card ${isHovered ? 'hovered' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <h2>{title}</h2>
        {content && <p>{content}</p>}
        {isHovered && <div className="highlight" style={{ backgroundColor: 'blue' }}></div>}
      </div>
    </div>
  );
};

export default Card;
