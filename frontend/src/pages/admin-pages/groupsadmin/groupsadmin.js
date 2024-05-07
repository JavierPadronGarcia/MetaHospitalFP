import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import GroupsService from '../../../services/groups.service';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, DatePicker, message } from 'antd';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { AutoComplete } from 'antd';
import { Link } from 'react-router-dom';
import CoursesService from '../../../services/courses.service';
import './groupsadmin.css';
import dayjs from 'dayjs';
import SearchComponent from '../../../components/search/search';
import useNotification from '../../../utils/shared/errorHandler';
import { useTranslation } from 'react-i18next';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';

function GroupsAdmin() {
  const [t] = useTranslation('global');
  const {
    noConnectionError,
    groupGetError,
    courseGetError,
    groupCreateSuccessful,
    groupDeleteFail,
    groupDeleteSuccessful,
    groupUpdateOrCreateFail,
    groupUpdateSuccessful
  } = useNotification();
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [yearRange, setYearRange] = useState('');
  const [range, setRange] = useState([null, null]);
  const [Id, setId] = useState('');
  const Headlines = [t('name_s'), t('date')];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [courseId, setCourseId] = useState('');
  const [showPop, setShowPop] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const columnTypes = [{
    type: {
      Nombre: 'string',
      Fecha: 'date',
    }, name: {
      Nombre: 'name',
      Fecha: 'date',
    }
  }];

  const { RangePicker } = DatePicker;

  const getGroups = async () => {
    try {
      const groupsList = await GroupsService.getAllGroupsWithoutCount(localStorage.getItem('schoolId'));
      setGroups(groupsList);
      setFilteredData(groupsList);
    } catch (error) {
      groupGetError();
    }
  };

  const getCourses = async () => {
    try {
      const courseList = await CoursesService.getCourses();
      setCourses(courseList);
    } catch (error) {
      courseGetError();
    }
  }

  useEffect(() => {
    getGroups();
    getCourses();
  }, []);

  const navigateGroups = (id, name) => {
    localStorage.setItem('groupsId', id);
    localStorage.setItem('groupsName', name)
  }

  const renderGroupsRow = (Groups) => (
    <>
      <td><Link onClick={() => navigateGroups(Groups.id, Groups.name)} to='/admin/group' >{Groups.name}</Link></td>
      <td>{Groups.date}</td>
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

  const renderGroupsImputs = () => (
    <>
      <h1>{getTranslation(String(mode))}</h1>
      <p>{t('name_s')}</p>
      <Input
        placeholder={t('name_s')}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>{t('year')}</p>
      <RangePicker
        picker="year"
        placeholder={[t('start_year'), t('end_year')]}
        value={range}
        onPanelChange={handlePanelChange}
      />
      <p>{t('course_s')}</p>
      <AutoComplete
        style={{ width: 200 }}
        options={courses.map(course => ({ value: course.name, label: course.name, id: course.id }))}
        placeholder={t('course_p')}
        filterOption={(inputValue, option) =>
          option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onSelect={(value, option) => setCourseId(option.id)}
      />
    </>
  );

  const handlePanelChange = (value, mode) => {
    if (Array.isArray(value) && value.length === 2) {
      const validDates = value.filter(date => date !== null && date !== undefined);
      setRange(value);
      if (validDates.length === 2) {
        const [startYear, endYear] = validDates.map(date => date.year());
        setYearRange(`${startYear}-${endYear}`);
      }
    }
  };

  const onDelete = async (id) => {
    try {
      await GroupsService.deleteGroup(id);
      getGroups();
      groupDeleteSuccessful();
    } catch (error) {
      groupDeleteFail();
    }
  };

  const Edit = (id, editType) => {
    const groupsToEdit = groups.find(groups => groups.id === id);

    setId(id);

    if (editType === 'popform') {
      setShowPop(true);
    } else {
      setShowPop(false);
    }

    if (groupsToEdit.date) {
      setYearRange(groupsToEdit.date);
      const [startYear, endYear] = groupsToEdit.date.split('-');
      setRange([dayjs(startYear), dayjs(endYear)]);
    } else {
      setYearRange('');
      setRange([null, null]);
    }

    setName(groupsToEdit.name);
    setMode(Consts.EDIT_MODE);
  };

  const onSubmit = async () => {
    try {

      if (!name || !yearRange || !courseId) {
        throw new Error(t('fill_all_fields'));
      }

      if (mode === Consts.EDIT_MODE) {
        const groupsToEdit = groups.find(groups => groups.id === Id);

        groupsToEdit.name = name;
        groupsToEdit.date = yearRange;
        groupsToEdit.CourseId = courseId;
        groupsToEdit.id = Id;

        await GroupsService.updateGroup(groupsToEdit);

        groupUpdateSuccessful();
        getGroups();
      } else {
        const Groups = {
          name: name,
          date: yearRange,
          CourseId: courseId
        };

        await GroupsService.addGroup(Groups, localStorage.getItem('schoolId'));
        getGroups();
        groupCreateSuccessful();
      }
      Cancel();
    } catch (error) {
      if (error.message === 'No fields filled') {
        message.error(t('fill_all_fields'));
      } else if (error.message === 'Network Error') {
        noConnectionError();
      } else {
        groupUpdateOrCreateFail();
      }
    }
  };

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
    setName('');
    setRange([null, null]);
  };

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className='container groupsadmin-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name={t('group_p')} />
        <SearchComponent data={groups} onSearch={handleSearch} fieldName="name" />
        <BasicList items={filteredData} renderRow={renderGroupsRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit} columnTypes={columnTypes}></BasicList>
        <PopForm renderInputs={renderGroupsImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={{ editMode: mode === Consts.EDIT_MODE, showPop: showPop }} />
        <FloatingExcelButton data={groups} name={`grupos - ${localStorage.getItem('schoolName')}`} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderGroupsImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default GroupsAdmin;

