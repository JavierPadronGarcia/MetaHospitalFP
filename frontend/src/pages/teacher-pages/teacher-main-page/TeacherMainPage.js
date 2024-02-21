import './TeacherMainPage.css';
import Toolbar from '../../../components/toolbar/Toolbar';
import teacherGroupService from '../../../services/teacherGroup.service';
import { useEffect, useState } from 'react';
import { decodeToken } from '../../../utils/shared/globalFunctions';
import { LoadingOutlined } from '@ant-design/icons';
import { errorMessage, noConnectionError } from '../../../utils/shared/errorHandler';
import Headers from '../../../components/headers/headers';
import CardUnits from '../../../components/cardUnits/cardunits';

function TeacherMainPage() {

  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const teacher = decodeToken();

  const getAllGroups = async () => {
    try {
      const groupArray = await teacherGroupService.getAllGroupsAssignedToTeacher(teacher.id);
      setAllGroups(groupArray);
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
    allGroups.map((item, index) =>
      <CardUnits title={item.group.name} date={item.group.date} route={`./group/${item.group.name}/${item.group.id}`} />
    )
  )

  return (
    <div className="teacher-page">
      <Headers  title='Mis grupos' />
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