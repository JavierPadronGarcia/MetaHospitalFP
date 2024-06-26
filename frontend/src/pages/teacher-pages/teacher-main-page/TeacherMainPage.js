import './TeacherMainPage.css';
import teacherGroupService from '../../../services/teacherGroup.service';
import { useEffect, useState } from 'react';
import { decodeToken } from '../../../utils/shared/globalFunctions';
import { LoadingOutlined } from '@ant-design/icons';
import useNotification from '../../../utils/shared/errorHandler';
import Headers from '../../../components/headers/headers';
import CardUnits from '../../../components/cardUnits/cardunits';
import { useTranslation } from 'react-i18next';

function TeacherMainPage() {

  const [t] = useTranslation('global');
  const { noConnectionError, errorGettingGroups } = useNotification();
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const teacher = decodeToken();
  const [filteredData, setFilteredData] = useState([]);

  const getAllGroups = async () => {
    try {
      const groupArray = await teacherGroupService.getAllGroupsAssignedToTeacher(teacher.id);
      setAllGroups(groupArray);
      setFilteredData(groupArray.map(item => item.group))
      setLoading(false);
    } catch (err) {
      if (!err.response) {
        noConnectionError();
      }

      if (err.response && err.code === 500) {
        errorGettingGroups();
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllGroups();
  }, []);

  const showGroups = () => (
    filteredData.map((item, index) =>
      <CardUnits title={item.name} date={item.date} route={`./group/${item.name}/${item.id}`} color={'#FF704A'} />
    )
  )

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className="teacher-page">
      <Headers title={t('my_groups')} data={allGroups.map(item => item.group)} onSearch={handleSearch} fieldName="name" />
      <div className='teacher-page-main'>
        {loading &&
          <LoadingOutlined style={{ fontSize: 60, color: '#08c', display: 'flex', justifyContent: 'center' }} />
        }
        {showGroups()}
      </div>
    </div>
  );
}

export default TeacherMainPage;