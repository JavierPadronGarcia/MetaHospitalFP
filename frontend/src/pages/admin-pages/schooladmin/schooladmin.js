import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import SchoolsService from '../../../services/schools.service';
import Menu from '../../../components/menu/menu';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, message } from 'antd';
import { Consts } from '../../../constants/modes';
import { Link } from 'react-router-dom';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './schooladmin.css';
import useNotification from '../../../utils/shared/errorHandler';
import SearchComponent from '../../../components/search/search';
import { useTranslation } from 'react-i18next';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';

function SchoolsAdmin() {
  const [t] = useTranslation('global');
  const { noConnectionError, schoolCreateFail, noNameError, schoolGetFail } = useNotification();
  const [Schools, setSchools] = useState([]);
  const [name, setName] = useState('');
  const [Id, setId] = useState('');
  const Headlines = [t('name_s')];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [showPop, setShowPop] = useState(false);
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);

  const getSchools = async () => {
    try {
      const response = await SchoolsService.getSchools(localStorage.getItem('AccessToken'));
      const schoolList = response;
      setSchools(schoolList);
      setFilteredData(schoolList);
    } catch (error) {
      schoolGetFail();
    }
  };

  useEffect(() => {
    getSchools();
  }, []);

  const navigateSchool = (id, name) => {
    localStorage.setItem('schoolId', id);
    localStorage.setItem('schoolName', name)
  }

  const renderSchoolRow = (school) => (
    <>
      <td><Link onClick={() => navigateSchool(school.id, school.name)} to='/admin/school' >{school.name}</Link></td>
    </>
  );

  const getTranslation = (mode) => {
    switch (mode) {
      case Consts.ADD_MODE:
        return t('add');
      case Consts.EDIT_MODE:
        return t('edit');
      default:
        return mode;
    }
  }

  const renderSchoolImputs = () => (
    <>
      <h1>{getTranslation(String(mode))}</h1>
      <p>{t('name_s')}</p>
      <Input placeholder={t('name_s')}
        value={name}
        onChange={(e) => setName(e.target.value)} />
    </>
  );

  const onDelete = async (id) => {
    try {
      await SchoolsService.deleteSchool(id);
      getSchools();
    } catch (error) {
      message.error(error.message);
    }
  }

  const Edit = (id, editType) => {
    const schoolToEdit = Schools.find(school => school.id === id);

    setId(id);

    if (editType === 'popform') {
      setShowPop(true);
    } else {
      setShowPop(false);
    }

    setName(schoolToEdit.name);
    setMode(Consts.EDIT_MODE);
  }

  const onSubmit = async () => {
    try {

      if (!name) {
        throw new Error(t('no_name_error'));
      }

      if (mode === Consts.EDIT_MODE) {
        const schoolToEdit = Schools.find(school => school.id === Id);

        schoolToEdit.name = name;

        await SchoolsService.updateSchool(Id, schoolToEdit);

        message.success(t('school_update_successful'))
        getSchools();
      } else {
        const school = {
          name: name,
        };

        await SchoolsService.createNewSchool(school);
        getSchools();

        message.success(t('school_create_successful'))
      }
      Cancel();
    } catch (error) {
      if (error.message === 'No name') {
        noNameError();
      } else if (error.message === 'Network Error') {
        noConnectionError();
      } else {
        schoolCreateFail();
      }
    }
  }

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
    setName('');
  }

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className='container schooladmin-page'>
      <div className='container-left'>
        <Menu />
        <Tag name={t('school_p')} />
        <SearchComponent data={Schools} onSearch={handleSearch} fieldName="name" />
        <BasicList items={filteredData} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
        <FloatingExcelButton data={Schools} name={'escuelas'} />
        <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={{ editMode: mode === Consts.EDIT_MODE, showPop: showPop }} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );

}

export default SchoolsAdmin;