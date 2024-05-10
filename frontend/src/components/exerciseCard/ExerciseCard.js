import React, { useState } from 'react';
import './ExerciseCard.css';
import ArrowToggle from '../arrowToggle/ArrowToggle';
import GradeCard from '../grade-card/GradeCard';

const ExerciseCard = ({ title, participationGrades: { finalGrade, itemGrades }, date }) => {
  const fecha = new Date('2024-04-12T10:25:04.000Z');
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const opcionesHora = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

  const fechaBonita = fecha.toLocaleDateString('es-ES', opcionesFecha);
  const horaBonita = fecha.toLocaleTimeString('es-ES', opcionesHora);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = (expandedState) => {
    setIsExpanded(expandedState);
  }

  return (
    <div className="exercise-card-container">
      <div className='exercise-card'>
        <h2 className='exercise-title'>{title}</h2>
        <div className='exercise-head'>
          <div className='exercise-description'>
            <div className='exercise-info'>
              <div className='exercise-info-item'>
                <span className='info-label'>Fecha:</span>
                <span className='info-value'>{fechaBonita}</span>
              </div>
              <div className='exercise-info-item'>
                <span className='info-label'>Hora:</span>
                <span className='info-value'>{horaBonita}</span>
              </div>
            </div>
          </div>
          <div className='grade-container'>
            <span className='info-label'>Calificación:</span>
            <span className={`grade ${finalGrade && finalGrade > 5 ? 'green' : 'red'}`} style={{fontSize: '1.5rem'}}>
              {finalGrade ?? '---'}
            </span>
          </div>
          {itemGrades && itemGrades.length !== 0 &&
            <div className='display'>
              <ArrowToggle onToggle={toggleExpanded} />
            </div>
          }
        </div>
        <div className={`grades-container ${!isExpanded && 'hidden'}`}>
          <div className='grades-scroll'>
            {itemGrades &&
              itemGrades.map(({ gradeId, gradeCorrect, gradeValue, itemName }, index) => (
                <GradeCard
                  key={gradeId}
                  title={itemName}
                  grade={gradeValue}
                  correct={gradeCorrect}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;

