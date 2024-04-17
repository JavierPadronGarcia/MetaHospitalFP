import React, { useState } from 'react';
import './ExerciseCard.css';
import ArrowToggle from '../arrowToggle/ArrowToggle';
import GradeCard from '../grade-card/GradeCard';

const ExerciseCard = ({ title, participationGrades: { finalGrade, itemGrades } }) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = (expandedState) => {
    setIsExpanded(expandedState);
  }

  return (
    <div className="exercise-card-container" >
      <div className='exercise-card'>
        <div className='exercise-head'>
          <div className='exercise-description'>
            <h2>{title}</h2>
            <p>Calificación: <span className='grade'>{finalGrade ?? 'No calificado'}</span></p>
          </div>
          {itemGrades &&
            <div className='display'>
              <ArrowToggle onToggle={toggleExpanded} />
            </div>
          }
        </div>
        <div className={`grades-container ${!isExpanded && 'hidden'}`}>
          <div className='grades-scroll'>
            {itemGrades &&
              itemGrades.map(({ gradeId, gradeCorrect, gradeValue, itemName, itemDescription }, index) => (
                <GradeCard
                  key={gradeId}
                  title={itemName}
                  description={itemDescription}
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