import './TeacherActivitiesPage.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ActivityForm from '../../../components/activity-form/ActivityForm';
import ActivityCard from '../../../components/activity-card/ActivityCard';
import { useEffect, useState } from 'react';
import exercisesService from '../../../services/exercises.service';
import useNotification from '../../../utils/shared/errorHandler';
import { message } from 'antd';
import Headers from '../../../components/headers/headers';
import Tag from '../../../components/tag/tag';

function TeacherActivitiesPage() {

  const { noConnectionError, errorMessage } = useNotification();

  const { name, id, workUnitId, workUnitName } = useParams();
  const colors = JSON.parse(sessionStorage.getItem('colors'));

  const [assignedExercises, setAssignedExercises] = useState([]);
  const [unAssignedExercises, setUnAssignedExercises] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const getAllExercises = () => {
    exercisesService.getAllExercisesOfTheGroup(id, workUnitId).then(exercises => {
      setAssignedExercises(exercises.filter(exercise => Boolean(exercise.assigned) === true));
      setFilteredData(exercises.filter(exercise => Boolean(exercise.assigned) === true));
      setUnAssignedExercises(exercises.filter(exercise => Boolean(exercise.assigned) === false));
    }).catch(err => {
      if (!err.response) {
        noConnectionError();
      }

      if (err.response && err.code === 500) {
        errorMessage('Hubo un error buscando las actividades', 'Intentelo de nuevo');
      }
    });
  }

  useEffect(() => {
    getAllExercises();
  }, [])

  const handleDelete = (activityId) => {
    exercisesService.deleteExercise(activityId).then(response => {
      message.success('Actividad eliminada correctamente', 2);
      getAllExercises();
    }).catch(err => {
      if (!err.response) {
        noConnectionError();
      }

      if (err.response && err.code === 500) {
        errorMessage('No se ha podido eliminar la actividad', 'Intentelo de nuevo');
      }
    })
  }

  const navigateTo = (id) => {
    const route = location.pathname + '/' + id;
    navigate(route)
  }

  const showAssignedExercises = () => (
    filteredData.map(exercise => {
      return (
        <ActivityCard
          key={exercise.exerciseId}
          edit={true}
          caseId={exercise.id}
          activityId={exercise.exerciseId}
          title={exercise.name}
          description={exercise.finishDate}
          assigned={true}
          notifyDelete={(activityId) => handleDelete(activityId)}
          notifyUpdateInfo={() => getAllExercises()}
          onClick={navigateTo}
        />
      )
    })
  )

  const showUnAssignedExercises = () => (
    unAssignedExercises.map(exercise => {
      return (
        <ActivityCard
          key={exercise.exerciseId}
          edit={true}
          caseId={exercise.id}
          activityId={exercise.exerciseId}
          title={exercise.name}
          assigned={false}
          notifyDelete={(activityId) => handleDelete(activityId)}
          notifyUpdateInfo={() => getAllExercises()}
        />
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
        <ActivityForm groupId={id} workUnitId={workUnitId} notifyUpdateInfo={getAllExercises} />
      </div>
    </div>
  );
}

export default TeacherActivitiesPage;