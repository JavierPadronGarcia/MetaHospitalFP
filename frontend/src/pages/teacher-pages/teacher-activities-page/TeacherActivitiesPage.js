import './TeacherActivitiesPage.css';
import { useParams } from 'react-router-dom';
import Add from '../../../components/add/Add';
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

  const handleDelete = (activityId, assigned, finishDate) => {
    exercisesService.deleteExercise(id, workUnitId, activityId, assigned, finishDate).then(response => {
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
          key={exercise.id}
          edit={true}
          id={exercise.id}
          title={exercise.name}
          description={exercise.finishDate}
          assigned={true}
          notifyDelete={(activityId, finishDate) => handleDelete(activityId, true, finishDate)}
          notifyUpdateInfo={() => getAllExercises()}
        />
      )
    })
  )

  const showUnAssignedExercises = () => (
    unAssignedExercises.map(exercise => {
      return (
        <ActivityCard
          key={exercise.id}
          edit={true}
          id={exercise.id}
          title={exercise.name}
          assigned={false}
          notifyDelete={(activityId) => handleDelete(activityId, false)}
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
            <Add
              link={`./add`}
              colors={{ background: colors.secondaryColor, text: colors.text }}
            />
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
      </div>
    </div>
  );
}

export default TeacherActivitiesPage;