import React, { useEffect, useState } from 'react';
import Headers from '../../../components/headers/headers';
import groupsService from '../../../services/groups.service';
import Tag from '../../../components/tag/tag';
import './studenthome.css'
import CardUnits from '../../../components/cardUnits/cardunits';
import workUnitGroupsService from '../../../services/workUnitGroups.service';

const Studenthome = () => {
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState(null);
  const [workUnits, setWorkUnits] = useState([]);

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
    } catch (err) {
      console.log('Error: ' + err)
    }
  }

  useEffect(() => {
    getGroup();
  }, []);

  return (
    <div className="student-home">
      <Headers title={title} groupId={groupId} />
      <div className='container-scloll'>
        <Tag name="Unidades" className="tags" />
        {workUnits.map((workUnit, index) => {
          if (workUnit.visibility)
            return <CardUnits key={index}
              title={workUnit.workUnit.name}
              route={`/student/workUnit`}
              workUnit={workUnit.workUnit}
            />
        })}
      </div>
    </div>
  );
}

export default Studenthome;