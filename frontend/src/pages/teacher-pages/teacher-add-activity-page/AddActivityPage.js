import './AddActivityPage.css';
import ActivityForm from '../../../components/activity-form/ActivityForm';
import { useParams } from 'react-router-dom';
import GoBack from '../../../components/go-back/GoBack';
import Headers from '../../../components/headers/headers';

function AddActivityPage() {

  const { id, name, workUnitId, workUnitName } = useParams();

  return (
    <div className='add-activity-page'>
      <Headers title={'Agregando actividad'} />
      <div className='add-activity-page-form'>
        <ActivityForm groupId={id} workUnitId={workUnitId} />
      </div>
    </div>
  )
}
export default AddActivityPage;