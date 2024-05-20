import React, { useEffect, useState } from 'react';
import WorkUnitComponent from '../../../components/work-unit/WorkUnitComponent';
import workUnitGroupService from '../../../services/workUnitGroups.service';
import exercisesService from '../../../services/exercises.service';
import GradeService from '../../../services/grade.service';
import useNotification from '../../../utils/shared/errorHandler';
import ExerciseCard from '../../exerciseCard/ExerciseCard';
import { Card, message, Button } from 'antd';
import { LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './units-cases-grades-view.css';

function UnitsCasesGradesView({ groupId }) {
    const [t] = useTranslation('global');
    const [workUnitId, setWorkUnitId] = useState();
    const [exerciseId, setExerciseId] = useState();
    const [grades, setGrades] = useState([]);
    const { noConnectionError, errorMessage } = useNotification();
    const [allWorkUnits, setAllWorkUnits] = useState([]);
    const [assignedExercises, setAssignedExercises] = useState([]);
    const [state, setState] = useState('WorkUnits');

    const fetchAllWorkUnits = async () => {
        try {
            const workUnits = await workUnitGroupService.getAllWorkUnitsWithColorsByGroup(groupId);
            setAllWorkUnits(workUnits);
        } catch (err) {
            if (!err.response) {
                noConnectionError();
            }
        }
    }

    const fetchAllExercises = async () => {
        try {
            const exercises = await exercisesService.getAllExercisesOfTheGroup(groupId, workUnitId);
            setAssignedExercises(exercises);
        } catch (err) {
            if (!err.response) {
                noConnectionError();
            }
            if (err.response && err.code === 500) {
                errorMessage('Hubo un error buscando las actividades', 'Intentelo de nuevo');
            }
        }
    }

    const fetchAllGrades = async () => {
        try {
            const grades = await GradeService.getGradesByExercises(exerciseId);
            setGrades(grades);
        } catch (err) {
            message.error('Error al obtener ejercicios');
        }
    }

    useEffect(() => {
        fetchAllWorkUnits();
    }, []);

    useEffect(() => {
        if (workUnitId) {
            fetchAllExercises();
        }
    }, [workUnitId]);

    useEffect(() => {
        if (exerciseId) {
            fetchAllGrades();
        }
    }, [exerciseId]);

    const handleUpdateVisibility = async (workUnitId, visibility) => {
        try {
            await workUnitGroupService.updateWorkUnitVisibility(groupId, workUnitId, visibility);
        } catch (err) {
            if (!err.response) {
                noConnectionError();
            }
        }
    }

    const handleState = (workUnitId, exerciseId) => {
        if (state === 'WorkUnits') {
            setWorkUnitId(workUnitId);
            setState('Exercises');
        } else if (state === 'Exercises') {
            setExerciseId(exerciseId);
            setState('Activities');
        }
    }

    const handleBack = () => {
        if (state === 'Activities') {
            setState('Exercises');
            setExerciseId();
        } else if (state === 'Exercises') {
            setState('WorkUnits');
            setWorkUnitId();
        }
    }

    const handleReload = () => {
        if (state !== 'WorkUnits') {
            setState('WorkUnits');
        }
    }

    const showAssignedExercises = () => (
        assignedExercises.map(exercise => (
            <Card
                title={`${t('case_s')} ${exercise.caseNumber}`}
                style={{ margin: '1rem', width: '90%' }}
                key={exercise.id}
                onClick={() => handleState(workUnitId, exercise.id)}>
                {exercise.name}
            </Card>
        ))
    );

    const showWorkUnits = () => (
        <div className='units-grades-view'>
            {allWorkUnits.map((workUnitGroup) => (
                <WorkUnitComponent
                    workUnit={workUnitGroup.workUnit}
                    unitVisibility={workUnitGroup.visibility}
                    key={workUnitGroup.workUnit.id}
                    notifyUpdateVisibility={handleUpdateVisibility}
                    handleState={() => handleState(workUnitGroup.workUnit.id)}
                />
            ))}
        </div>
    );

    const showGrades = () => (
        <div className='student-exercises-assigned-exercises'>
            {grades.map((grade, index) => (
                <ExerciseCard
                    key={index}
                    title={grade.studentName}
                    participationGrades={{ finalGrade: grade.finalGrade, itemGrades: grade.grades }}
                    date={grade.submittedAt}
                />
            ))}
        </div>
    );

    return (
        <div className='units-cases-grades-view'>
            <div className='Buttons' style={{ display: 'flex', marginTop: '1rem' }}>
                <Button
                    type="primary"
                    icon={<LeftOutlined />}
                    style={{ marginRight: '1rem' }}
                    onClick={handleBack}
                >
                    Atras
                </Button>
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={handleReload}
                >
                    Volver
                </Button>
            </div>

            {state === 'WorkUnits' && showWorkUnits()}
            {state === 'Exercises' && showAssignedExercises()}
            {state === 'Activities' && showGrades()}
        </div>
    );
}

export default UnitsCasesGradesView;
