import React, { useEffect } from 'react';
import Tag from '../../../components/tag/tag';
import Menu2 from '../../../components/menu2/menu2';
import SearchComponent from '../../../components/search/search';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { useTranslation } from 'react-i18next';
import GradesService from '../../../services/grade.service';
import ExerciseCard from '../../../components/exerciseCard/ExerciseCard';
import workUnitGroupsService from '../../../services/workUnitGroups.service';
import WorkUnitComponent from '../../../components/work-unit/WorkUnitComponent';    

function GroupsGrades() {
    const [t] = useTranslation();
    const [grades, setGrades] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);
    const [allWorkUnits, setAllWorkUnits] = React.useState([]);

    const getAllGradesOnAGroup = async () => {
        try {
            const gradesresponse = await GradesService.getAllGradesOnAGroup(localStorage.getItem('groupsId'));
            console.log(gradesresponse);
            setGrades(gradesresponse);
            setFilteredData(gradesresponse);
        } catch (error) {
            console.log(error);
        }
    }

    const getWorkUnits = async () => {
        try {
            const workUnits = await workUnitGroupsService.getAllWorkUnitsWithColorsByGroup(localStorage.getItem('groupsId'));
            console.log(workUnits);
            setAllWorkUnits(workUnits);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllGradesOnAGroup();
        getWorkUnits();
    }, []);

    const showAssignedExercises = () => (
        <div className='student-exercises-assigned-exercises'>
            {filteredData.map((exercise, index) => (
                <ExerciseCard
                    key={index}
                    title={exercise.studentName}
                    participationGrades={{ finalGrade: exercise.finalGrade, itemGrades: exercise?.grades }}
                    date={exercise.submittedAt}
                />
            ))}
        </div>
    )

    const handleSearch = (filteredData) => {
        setFilteredData(filteredData);
    };

    return (
        <div className='container groupsgrades-page'>
            <div className='container-left'>
                <Menu2 />
                <Tag name={localStorage.getItem('groupsName')} color={'#FF704A'} />
                <SearchComponent data={grades} onSearch={handleSearch} fieldName={'studentName'} />
                {/* {showWorkUnits()} */}
            </div>
            <div className='container-right'>
                <Rightmenu />
            </div>
        </div >
    );
}

export default GroupsGrades;