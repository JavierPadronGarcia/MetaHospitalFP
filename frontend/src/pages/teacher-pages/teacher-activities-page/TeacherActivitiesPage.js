import './TeacherActivitiesPage.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ActivityForm from '../../../components/activity-form/ActivityForm';
import ActivityCard from '../../../components/activity-card/ActivityCard';
import { useEffect, useState } from 'react';
import exercisesService from '../../../services/exercises.service';
import useNotification from '../../../utils/shared/errorHandler';
import { Card, message } from 'antd';
import Headers from '../../../components/headers/headers';
import Tag from '../../../components/tag/tag';
import { useTranslation } from 'react-i18next';

function TeacherActivitiesPage() {

  const [t] = useTranslation('global');

  const { noConnectionError, exerciseGetError } = useNotification();

  const { name, id, workUnitId, workUnitName } = useParams();
  const colors = JSON.parse(sessionStorage.getItem('colors'));

  const [assignedExercises, setAssignedExercises] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const getAllExercises = () => {
    exercisesService.getAllExercisesOfTheGroup(id, workUnitId).then(exercises => {
      setAssignedExercises(exercises);
      setFilteredData(exercises);
    }).catch(err => {
      if (!err.response) {
        noConnectionError();
      } else {
        exerciseGetError();
      }
    });
  }

  useEffect(() => {
    getAllExercises();
  }, [])

  const navigateTo = (id) => {
    const route = location.pathname + '/' + id;
    navigate(route)
  }

  const showAssignedExercises = () => (
    filteredData.map(exercise => {
      return (
        <Card title={`${t('case_s')} ${exercise.caseNumber}`} onClick={() => navigateTo(exercise.exerciseId)} style={{ margin: '1rem', width: '100%' }}>
          {exercise.name}
        </Card>
      )
    })
  )

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className='teacher-activities-page'>
      <Headers title={name} Page={'selected'} groupData={{ groupId: id, groupName: name }} data={assignedExercises} onSearch={handleSearch} fieldName="name" />
      <div className='teacher-activities-page-main'>
        <Tag name={workUnitName} color={colors.primaryColor} />
        <div style={{ display: 'flex', alignItems: 'center' }} className='activity-section'>
          {showAssignedExercises()}
        </div>
      </div>
    </div>
  );
}

export default TeacherActivitiesPage;