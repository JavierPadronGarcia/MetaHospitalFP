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
import UnitsCasesGradesView from '../../../components/views/units-cases-grades-view/units-cases-grades-view';

function GroupsGrades() {
    const [t] = useTranslation();
    const groupId = localStorage.getItem('groupsId');
    const [grades, setGrades] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);
    const [allWorkUnits, setAllWorkUnits] = React.useState([]);


    const handleSearch = (filteredData) => {
        setFilteredData(filteredData);
    };

    return (
        <div className='container groupsgrades-page'>
            <div className='container-left'>
                <Menu2 />
                <Tag name={localStorage.getItem('groupsName')} color={'#FF704A'} />
                <SearchComponent data={grades} onSearch={handleSearch} fieldName={'studentName'} />
                <UnitsCasesGradesView groupId={groupId} />
            </div>
            <div className='container-right'>
                <Rightmenu currentRoute={'/admin/courses'} />
            </div>
        </div >
    );
}

export default GroupsGrades;