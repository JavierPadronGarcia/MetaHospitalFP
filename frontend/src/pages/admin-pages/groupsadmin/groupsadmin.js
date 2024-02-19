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

function GroupsAdmin() {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [yearRange, setYearRange] = useState('');
  const [Id, setId] = useState('');
  const Headlines = ['Nombre', 'Fecha'];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [courseId, setCourseId] = useState('')

  const { RangePicker } = DatePicker;

  const getGroups = async () => {
    try {
      const groupsList = await GroupsService.getAllGroupsWithoutCount();
      setGroups(groupsList);
    } catch (error) {
      console.error('Error fetching Groups:', error);
      message.error(error.message)
    }
  };

  const getCourses = async () => {
    try {
      const courseList = await CoursesService.getCourses();
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching Courses:', error);
      message.error(error.message)
    }
  }

  useEffect(() => {
    getGroups();
    getCourses();
  }, []);

  const navigateGroups = (id, name) => {
    localStorage.setItem('groupsId', id);
    localStorage.setItem('groupsName', name)
    console.log(id);
  }

  const renderGroupsRow = (Groups) => (
    <>
      <td><Link onClick={() => navigateGroups(Groups.id, Groups.name)} to='/admin/group' >{Groups.name}</Link></td>
      <td>{Groups.date}</td>
    </>
  );

  const renderGroupsImputs = () => (
    <>
      <h1>{String(mode)}</h1>
      <p>Name</p>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Año</p>
      <RangePicker
        picker="year"
        placeholder={['Start Year', 'End Year']}
        onPanelChange={handlePanelChange}
      />
      <p>Curso</p>
      <AutoComplete
        style={{ width: 200 }}
        options={courses.map(course => ({ value: course.name, label: course.name, id: course.id }))}
        placeholder="Cursos"
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

      if (validDates.length === 2) {
        const [startYear, endYear] = validDates.map(date => date.year());
        setYearRange(`${startYear}-${endYear}`);
        console.log('Modo actual:', mode);
      } else {
        console.error('No hay suficientes fechas válidas en el rango.');
        message.error(message)
      }
    }
  };


  const onDelete = async (id) => {
    try {
      await GroupsService.deleteGroup(id);
      getGroups();
      console.log('Groups deleted successfully');
    } catch (error) {
      console.error('Error delete Groups:', error);
      message.error(error.message)
    }
  };

  const Edit = (id) => {
    const groupsToEdit = groups.find(groups => groups.id === id);

    setId(id);

    if (groupsToEdit.date) {
      const [startYear, endYear] = groupsToEdit.date.split('-');
      setYearRange(`${startYear}-${endYear}`);
    } else {
      setYearRange('');
    }

    setName(groupsToEdit.name);
    setMode(Consts.EDIT_MODE);
  };

  const onSubmit = async () => {
    try {
      if (mode === Consts.EDIT_MODE) {
        const groupsToEdit = groups.find(groups => groups.id === Id);

        groupsToEdit.name = name;
        groupsToEdit.date = yearRange;
        groupsToEdit.CourseId = courseId;

        console.log(courseId)

        await GroupsService.updateGroup(Id, groupsToEdit);

        console.log('Groups updated successfully');
        getGroups();
      } else {
        const Groups = {
          name: name,
          date: yearRange,
          CourseId: courseId
        };

        await GroupsService.addGroup(Groups);
        getGroups();
        console.log('New Groups created successfully');
      }
    } catch (error) {
      console.error('Error updating/creating Groups:', error);
      message.error(error.message)
    }
  };

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
    setName('');
  };

  return (
    <div className='container groupsadmin-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name="Grupos" />
        <BasicList items={groups} renderRow={renderGroupsRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
        <PopForm renderInputs={renderGroupsImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={mode === Consts.EDIT_MODE} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderGroupsImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default GroupsAdmin;
