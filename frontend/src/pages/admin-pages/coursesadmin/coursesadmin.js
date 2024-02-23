import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import CoursesService from '../../../services/courses.service';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Input, message } from 'antd';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './coursesadmin.css';
import FloatingMenu from '../../../components/FloatingMenu/FloatingMenu';
import { noConnectionError } from '../../../utils/shared/errorHandler';

function CoursesAdmin() {
  const [Courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [acronyms, setAcronyms] = useState('');
  const [Id, setId] = useState('');
  const Headlines = ['Nombre', 'Acrónimo'];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [showPop, setShowPop] = useState(false);
  const location = useLocation();

  const getCourses = async () => {
    try {
      const response = await CoursesService.getCourses();
      setCourses(response);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const rendercoursesRow = (courses) => (
    <>
      <td>{courses.name}</td>
      <td>{courses.acronyms}</td>
    </>
  );

  const renderCoursesImputs = () => (
    <>
      <h1>{String(mode)}</h1>
      <p>Nombre</p>
      <Input placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <p>Acrónimo</p>
      <Input placeholder="Acrónimo"
        value={acronyms}
        onChange={(e) => setAcronyms(e.target.value)} />
    </>
  );

  const onDelete = async (id) => {
    try {
      await CoursesService.deleteCourse(id);
      getCourses();
      message.error('Curso eliminado correctamente');
    } catch (error) {
      message.error('No se pudo eliminar el curso');
    }
  }

  const Edit = (id, editType) => {
    const coursesToEdit = Courses.find(courses => courses.id === id);

    setId(id);

    if (editType === 'popform') {
      setShowPop(true);
    } else {
      setShowPop(false);
    }

    setName(coursesToEdit.name);
    setAcronyms(coursesToEdit.acronyms);
    setMode(Consts.EDIT_MODE);
  }

  const onSubmit = async () => {
    try {

      if (!name || !acronyms) {
        throw new Error('No fields filled');
      }

      if (mode === Consts.EDIT_MODE) {
        const coursesToEdit = Courses.find(courses => courses.id === Id);

        coursesToEdit.name = name;
        coursesToEdit.acronyms = acronyms;

        await CoursesService.updateCourse(Id, coursesToEdit);

        message.success('Curso actualizado correctamente');
        getCourses();
      } else {
        const courses = {
          name: name,
          acronyms: acronyms,
        };

        await CoursesService.createNewCourse(courses);
        getCourses();
        message.success('Curso creado correctamente');
      }
      Cancel();
    } catch (error) {
      if (error.message === 'No fields filled') {
        message.error('Rellena todos los campos');
      } else if (error.message === 'Network Error') {
        noConnectionError();
      } else {
        message.error('Error al crear/actualizar el curso');
      }
    }
  }

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
    setName('');
    setAcronyms('');
  }

  return (
    <div className='container coursesadmin-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name="Cursos" />
        <BasicList items={Courses} renderRow={rendercoursesRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
        <FloatingMenu />
        <PopForm renderInputs={renderCoursesImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={{ editMode: mode === Consts.EDIT_MODE, showPop: showPop }} />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderCoursesImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );

}

export default CoursesAdmin;