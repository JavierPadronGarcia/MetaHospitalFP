import { useEffect, useState } from 'react';
import Tag from '../../../components/tag/tag';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { useTranslation } from 'react-i18next';
import GradesService from '../../../services/grade.service';
import UnitsCasesGradesView from '../../../components/views/units-cases-grades-view/units-cases-grades-view';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useNotification from '../../../utils/shared/errorHandler';
import GradesByCasesView from '../../../components/views/gradesByCases/GradesByCasesView';
import ViewsSelector from '../../../components/views/viewsSelector/ViewsSelector';
import { Button } from 'antd';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';
import dayjs from 'dayjs';

function GroupsGrades() {
  const groupId = localStorage.getItem('groupsId');
  const navigate = useNavigate();

  const views = {
    "global": 'global',
    "workUnits": 'workUnits',
  }

  const [t] = useTranslation('global');
  const [searchParams, setSearchParams] = useSearchParams();
  const { noConnectionError } = useNotification();

  const [view, setView] = useState(searchParams.get('selectedView') || views.global);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    getAllGrades();
  }, []);

  useEffect(() => {
    setSearchParams({ selectedView: view });
  }, [view]);


  const getAllGrades = async () => {
    try {
      const grades = await GradesService.getAllGradesOnAGroup(groupId);
      setGrades(grades);
    } catch (err) {
      if (!err.response) {
        noConnectionError();
      }
    }
  }

  const handleViewChange = (newView) => {
    setView(() => views[newView]);
  }

  const returnView = () => {
    switch (view) {
      case views.global:
        return (
          <div className="grades-view">
            <GradesByCasesView
              groupId={groupId}
              dataFetched={() => { }}
              prefetchedData={grades}
              updatePrefetchedData={getAllGrades}
            />
          </div>
        )
      case views.workUnits:
        return <UnitsCasesGradesView groupId={groupId} />
    }
  }

  return (
    <div className='container groupsgrades-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag
          name={localStorage.getItem('groupsName')}
          color={'#FF704A'}
          leftButton={() => <Button type='primary' onClick={() => navigate('/admin/group')} shape='round'>{t('go_back')}</Button>}
        />
        <ViewsSelector selectedView={view} onViewChange={handleViewChange}>
          <Button className="views-selector-item" type='default' view={views.global}>
            <div className="views-selector-item-text">{t('global_view')}</div>
          </Button>
          <Button className="views-selector-item" view={views.workUnits}>
            <div className="views-selector-item-text">{t('workUnit_view')}</div>
          </Button>
        </ViewsSelector>
        {returnView()}
        <FloatingExcelButton forGrades={true} name={t('student_grades').replace(' ', '-') + "-" + localStorage.getItem('groupsName') + "-" + dayjs().format('YYYY-MM-DD')} />
      </div>
      <div className='container-right'>
        <Rightmenu currentRoute={'/admin/courses'} />
      </div>
    </div >
  );
}

export default GroupsGrades;