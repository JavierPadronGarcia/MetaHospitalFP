import './TeacherGroupPage.css';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import WorkUnitComponent from '../../../components/work-unit/WorkUnitComponent';
import workUnitGroupService from '../../../services/workUnitGroups.service';
import useNotification from '../../../utils/shared/errorHandler';
import Headers from '../../../components/headers/headers';

function TeacherGroupPage() {

  const { noConnectionError} = useNotification();
  const { name, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [allWorkUnits, setAllWorkUnits] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const getAllWorkUnits = async () => {
    try {
      const workUnits = await workUnitGroupService.getAllWorkUnitsWithColorsByGroup(id);
      setAllWorkUnits(workUnits);
      setFilteredData(workUnits);
    } catch (err) {
      if (!err.response) {
        noConnectionError();
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    getAllWorkUnits();
  }, []);

  const handleUpdateVisibility = async (workUnitId, visibility) => {
    try {
      await workUnitGroupService.updateWorkUnitVisibility(id, workUnitId, visibility);
    } catch (err) {
      if (!err.response) {
        noConnectionError();
      }
    }
  }

  const showWorkUnits = () => (
    filteredData.map((workUnitGroup) => (
      <WorkUnitComponent
        workUnit={workUnitGroup.workUnit}
        unitVisibility={workUnitGroup.visibility}
        key={workUnitGroup.workUnit.id}
        notifyUpdateVisibility={(workUnitId, visibility) => handleUpdateVisibility(workUnitId, visibility)}
      />
    ))
  )

  const handleSearch = (filteredData) => {
    console.log(filteredData);
    setFilteredData(filteredData);
  };

  return (
    <div className='teacher-group-page'>
      <Headers title={name} Page={'selected'} groupData={{groupId: id, groupName: name}} data={allWorkUnits} onSearch={handleSearch} fieldName="workUnit.name"/>
      <div className='teacher-group-page-main'>
        {loading &&
          <LoadingOutlined style={{ fontSize: 60, color: '#08c', display: 'flex', justifyContent: 'center' }} />
        }
        {showWorkUnits()}
      </div>
    </div>
  );
}

export default TeacherGroupPage;