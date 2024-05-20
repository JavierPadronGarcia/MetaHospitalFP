import './TeacherGroupPage.css';
import { useParams, useSearchParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import WorkUnitComponent from '../../../components/work-unit/WorkUnitComponent';
import workUnitGroupService from '../../../services/workUnitGroups.service';
import useNotification from '../../../utils/shared/errorHandler';
import Headers from '../../../components/headers/headers';
import GradesByCasesView from '../../../components/views/gradesByCases/GradesByCasesView';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';
import { useTranslation } from 'react-i18next';
import ViewsSelector from '../../../components/views/viewsSelector/ViewsSelector';
import gradeService from '../../../services/grade.service';

function TeacherGroupPage() {

  const views = {
    "global": 'global',
    "workUnits": 'workUnits',
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const { noConnectionError } = useNotification();
  const [t] = useTranslation('global');
  const { name, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingNumber, setLoadingNumber] = useState(0);
  const [allWorkUnits, setAllWorkUnits] = useState([]);
  const [gradesContent, setGradesContent] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [view, setView] = useState(searchParams.get('selectedView') || views.workUnits);

  const getAllWorkUnits = async () => {
    const workUnits = await workUnitGroupService.getAllWorkUnitsWithColorsByGroup(id);
    setAllWorkUnits(workUnits);
    setFilteredData(workUnits);
    updateLoading();
  }

  const getGradesContent = async () => {
    const data = await gradeService.getAllGradesOnAGroup(id);
    setGradesContent(data);
    updateLoading();
  }

  useEffect(() => {
    try {
      getAllWorkUnits();
      getGradesContent();
    } catch (err) {
      if (!err.response) {
        noConnectionError();
      }
    }
  }, []);

  useEffect(() => {
    if (loadingNumber === 2) {
      setLoading(false);
    }
  }, [loadingNumber]);

  useEffect(() => {
    setSearchParams({ selectedView: view });
  }, [view]);

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
    setFilteredData(filteredData);
  };

  const updateLoading = () => {
    setLoadingNumber((prevLoadingNumber) => prevLoadingNumber + 1);
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
              groupId={id}
              dataFetched={updateLoading}
              prefetchedData={gradesContent}
              updatePrefetchedData={getGradesContent}
            />
          </div>
        )
      case views.workUnits:
        return showWorkUnits()
    }
  }

  return (
    <div className='teacher-group-page'>
      <Headers title={name} Page={'selected'} groupData={{ groupId: id, groupName: name }} data={allWorkUnits} onSearch={handleSearch} fieldName="workUnit.name" />
      <ViewsSelector selectedView={view} onViewChange={handleViewChange}>
        <button className="views-selector-item" view={views.global}>
          <div className="views-selector-item-text">{t('global_view')}</div>
        </button>
        <button className="views-selector-item" view={views.workUnits}>
          <div className="views-selector-item-text">{t('workUnit_view')}</div>
        </button>
      </ViewsSelector>
      <div className='teacher-group-page-main'>
        {(loading) &&
          <LoadingOutlined style={{ fontSize: 60, color: '#08c', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
        }
        {returnView()}
      </div>
      <FloatingExcelButton forGrades={true} name={t('grades') + "-" + name} />
    </div>
  );
}

export default TeacherGroupPage;