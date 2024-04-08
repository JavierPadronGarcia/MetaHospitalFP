import './TeacherActivitiesPage.css';
import { useParams } from 'react-router-dom';
import ActivityForm from '../../../components/activity-form/ActivityForm';
import ActivityCard from '../../../components/activity-card/ActivityCard';
import { useEffect, useState } from 'react';
import exercisesService from '../../../services/exercises.service';
import { errorMessage, noConnectionError } from '../../../utils/shared/errorHandler';
import { message } from 'antd';
import Headers from '../../../components/headers/headers';
function TeacherActivitiesPage() {

  const { name, id, workUnitId, workUnitName } = useParams();
  const colors = JSON.parse(sessionStorage.getItem('colors'));

  const [assignedExercises, setAssignedExercises] = useState([]);
  const [unAssignedExercises, setUnAssignedExercises] = useState([]);

  const getAllExercises = () => {
    exercisesService.getAllExercisesOfTheGroup(id, workUnitId).then(exercises => {
      setAssignedExercises(exercises.filter(exercise => Boolean(exercise.assigned) === true));
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

  const showAssignedExercises = () => (
    assignedExercises.map(exercise => {
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

  return (
    <div className='teacher-activities-page'>
      <Headers title={name} Page={'selected'} groupData={{ groupId: id, groupName: name }} />
      <div className='teacher-activities-page-main'>
        <div style={{ background: colors.primaryColor }} className='activity-section'>
          <header>
            <span className='workUnitName' style={{ color: colors.text }}>{workUnitName}</span>
          </header>
          <main>

            <section className='evaluable-activities'>
              <header style={{ color: colors.text }}>
                <span>Actividades evaluadas</span>
              </header>
              <main>
                {showAssignedExercises()}
              </main>
            </section>

            <section className='non-evaluable-activities'>
              <header style={{ color: colors.text }}>
                <span>Actividades no evaluadas</span>
              </header>
              <main>
                {showUnAssignedExercises()}
              </main>
            </section>

          </main>
        </div>
        <ActivityForm groupId={id} workUnitId={workUnitId} notifyUpdateInfo={getAllExercises} />
      </div>
    </div>
  );
}

export default TeacherActivitiesPage;