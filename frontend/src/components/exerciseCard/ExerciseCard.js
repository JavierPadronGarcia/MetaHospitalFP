import React, { useState } from 'react';
import './ExerciseCard.css';
import ArrowToggle from '../arrowToggle/ArrowToggle';
import GradeCard from '../grade-card/GradeCard';
import dayjs from 'dayjs';
import useDayjsLocale from '../../utils/shared/getDayjsLocale';
import { useTranslation } from 'react-i18next';

const ExerciseCard = ({ title, participationGrades: { finalGrade, itemGrades }, date, customClass }) => {
  dayjs.locale(useDayjsLocale());

  const formatDate = dayjs(date).format('dddd, DD MMMM YYYY');
  const formatHour = dayjs(date).format('HH:mm');

  const [t] = useTranslation('global');
  const [isExpanded, setIsExpanded] = useState(false);
  const [handWashCount, setHandWashCount] = useState(0);

  const toggleExpanded = (expandedState) => {
    setIsExpanded(expandedState);
  }

  const renderGrades = (itemGrades) => {
    if (itemGrades && itemGrades.length !== 0) {

      const handWashes = itemGrades.filter(({ itemId }) => !itemId);
      const grades = itemGrades.filter(({ itemId }) => itemId);

      if (handWashes.length === 2) {
        grades.unshift(handWashes[1]);
        grades.push(handWashes[0]);
      }

      return grades.map(({ gradeId, gradeCorrect, gradeValue, itemName, itemId }, index) => {
        return (
          <GradeCard
            key={index}
            title={itemName}
            grade={gradeValue}
            correct={gradeCorrect}
          />
        )
      });
    }
  };

  return (
    <div className={`exercise-card-container ${customClass}`}>
      <div className='exercise-card'>
        <h2 className='exercise-title'>{title}</h2>
        <div className='exercise-head'>
          <div className='exercise-description'>
            <div className='exercise-info'>
              <div className='exercise-info-item'>
                <span className='info-label'>{t('date')}:</span>
                <span className='info-value'>{formatDate}</span>
              </div>
              <div className='exercise-info-item'>
                <span className='info-label'>{t('time')}:</span>
                <span className='info-value'>{formatHour}</span>
              </div>
            </div>
          </div>
          <div className='grade-container'>
            <span className='info-label'>{t('score')}:</span>
            <span className={`grade ${finalGrade && finalGrade > 5 ? 'green' : 'red'}`} style={{ fontSize: '1.5rem' }}>
              {Number(finalGrade).toFixed(2) ?? '---'}
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
            {renderGrades(itemGrades)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;

