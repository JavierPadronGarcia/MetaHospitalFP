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

function SchoolsAdmin() {
  const [Schools, setSchools] = useState([]);
  const [name, setName] = useState('');
  const [Id, setId] = useState('');
  const Headlines = ['Nombre'];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const location = useLocation();

  const getSchools = async () => {
    try {
      const response = await SchoolsService.getSchools(localStorage.getItem('AccessToken'));
      const schoolList = response;
      setSchools(schoolList);
    } catch (error) {
      console.error('Error fetching schools:', error);
      message.error(error.message)
    }
  };

  useEffect(() => {
    getSchools();
  }, []);

  const navigateSchool = (id, name) => {
    localStorage.setItem('schoolId', id);
    localStorage.setItem('schoolName', name)
    console.log(id);
  }


  const renderSchoolRow = (school) => (
    <>
      <td><Link onClick={() => navigateSchool(school.id, school.name)} to='/admin/school' >{school.name}</Link></td>
    </>
  );

  const renderSchoolImputs = () => (
    <>
      <h1>{String(mode)}</h1>
      <p>Name</p>
      <Input placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)} />
    </>
  );

  const onDelete = async (id) => {
    try {
      await SchoolsService.deleteSchool(id);
      getSchools();
      console.log('school deleted successfully');
    } catch (error) {
      console.error('Error delete school:', error);
      message.error(error.message);
    }
  }

  const Edit = (id) => {
    const schoolToEdit = Schools.find(school => school.id === id);

    setId(id);

    setName(schoolToEdit.name);
    setMode(Consts.EDIT_MODE);
  }

  const onSubmit = async () => {
    try {
      if (mode === Consts.EDIT_MODE) {
        const schoolToEdit = Schools.find(school => school.id === Id);

        schoolToEdit.name = name;

        await SchoolsService.updateSchool(Id, schoolToEdit);

        console.log('school updated successfully');
        message.success('school updated successfully')
        getSchools();
      } else {
        const school = {
          name: name,
        };

        await SchoolsService.createNewSchool(school);
        getSchools();
        console.log('New school created successfully');
        message.success('New school created successfully')
      }
    } catch (error) {
      console.error('Error updating/creating school:', error);
      message.error(error.message)
    }
  }

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
    setName('');
  }

  return (
    <div className='container schooladmin-page'>
      <div className='container-left'>
        <Menu />
        <Tag name='Escuelas' />
        <BasicList items={Schools} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
        <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={mode === Consts.EDIT_MODE} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );

}

export default SchoolsAdmin;