import './TeacherMainPage.css';
import teacherGroupService from '../../../services/teacherGroup.service';
import { useEffect, useState } from 'react';
import { decodeToken } from '../../../utils/shared/globalFunctions';
import { LoadingOutlined } from '@ant-design/icons';
import useNotification from '../../../utils/shared/errorHandler';
import Headers from '../../../components/headers/headers';
import CardUnits from '../../../components/cardUnits/cardunits';

function TeacherMainPage() {

  const { noConnectionError, errorMessage } = useNotification();
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
        errorMessage('Hubo un error buscando sus cursos', 'Intentelo de nuevo');
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllGroups();
  }, []);

  const showGroups = () => (
    filteredData.map((item, index) =>
      <CardUnits title={item.name} date={item.data} route={`./group/${item.name}/${item.id}`} color={'#FF704A'} />
    )
  )

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className="teacher-page">
      <Headers title='Mis grupos' data={allGroups.map(item => item.group)} onSearch={handleSearch} fieldName="name" />
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