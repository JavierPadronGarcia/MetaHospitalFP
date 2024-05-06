import React, { useEffect, useState } from 'react';
import Headers from '../../../components/headers/headers';
import groupsService from '../../../services/groups.service';
import Tag from '../../../components/tag/tag';
import CardUnits from '../../../components/cardUnits/cardunits';
import workUnitGroupsService from '../../../services/workUnitGroups.service';
import './studenthome.css';

const Studenthome = () => {
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState(null);
  const [workUnits, setWorkUnits] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const getGroup = async () => {
    try {
      const userGroup = await groupsService.getUserGroup();
      localStorage.setItem('studentGroup', JSON.stringify(userGroup));
      setTitle(userGroup.name);
      setGroupId(userGroup.id)
      getWorkUnits(userGroup.id);
    } catch (err) {
      console.log("Error: ", err);
    };
  };

  const getWorkUnits = async (groupId) => {
    try {
      const workUnits = await workUnitGroupsService.getAllWorkUnitsWithColorsByGroup(groupId);
      setWorkUnits(workUnits);
      setFilteredData(workUnits);
    } catch (err) {
      console.log('Error: ' + err)
    }
  }

  useEffect(() => {
    getGroup();
  }, []);

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className="student-home">
      <Headers title={title} groupId={groupId} data={workUnits} onSearch={handleSearch} fieldName="workUnit.name"/>
      <div className='container-scroll'>
        <Tag name="Unidades" className="tags" />
        {filteredData.map((workUnit, index) => {
          if (workUnit.visibility)
            return <CardUnits key={index}
              title={workUnit.workUnit.name}
              route={`/student/workUnit`}
              workUnit={workUnit.workUnit}
              color={workUnit.workUnit.colors.visible.primaryColor}
            />
        })}
      </div>
    </div>
  );
}

export default Studenthome;