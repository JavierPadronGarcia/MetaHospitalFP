import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { message, Select } from 'antd';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import teacherGroupService from '../../../services/teacherGroup.service';
import groupEnrolementService from '../../../services/groupEnrolement.service';
import Menu2 from '../../../components/menu2/menu2';
import './admincourse.css';
import SearchComponent from '../../../components/search/search';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';

function AdminCourse() {
  const [teachers, setTeachers] = useState([]);
  const [teachersInGroup, setTeachersInGroup] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsInGroup, setStudentsInGroup] = useState([]);
  const [Id, setId] = useState('');
  const Headlines = ['Nombre'];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const location = useLocation();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredTeacher, setFilteredTeacher] = useState([]);

  useEffect(() => {
    getTeachers();
    getTeachersInGroup();
    getStudents();
    getStudentInGroup();
  }, []);

  const getTeachers = async () => {
    try {
      const teacherlist = await teacherGroupService.getAllTeachersNotInAGroup();
      setTeachers(teacherlist);
    } catch (error) {
      console.error('Error fetching all teachers:', error);
      message.error(error.message)
    }
  };

  const getTeachersInGroup = async () => {
    try {
      const teacherlist = await teacherGroupService.getAllTeachersInAGroup(localStorage.getItem("groupsId"));
      setTeachersInGroup(teacherlist);
      setFilteredTeacher(teacherlist);
    } catch (error) {
      console.error('Error fetching teachers in group:', error);
      message.error(error.message)
    }
  };

  const getStudents = async () => {
    try {
      const studentslist = await groupEnrolementService.getAllStudentsNotInAGroup();
      setStudents(studentslist);
    } catch (error) {
      console.error('Error fetching all students:', error);
      message.error(error.message)
    }
  };

  const getStudentInGroup = async () => {
    try {
      const studentslist = await groupEnrolementService.getAllStudentsInAGroup(localStorage.getItem("groupsId"));
      setStudentsInGroup(studentslist);
      setFilteredStudents(studentslist);
    } catch (error) {
      console.error('Error fetching students in group:', error);
      message.error(error.message)
    }
  };

  const renderStudentsRow = (student) => (
    <>
      <td>{student.name}</td>
    </>
  );

  const renderTeachersRow = (teacher) => (
    <>
      <td>{teacher.name}</td>
    </>
  );

  const renderSchoolImputs = () => {

    const handleTeacherChange = (value, option) => {
      setSelectedTeacher(value);
      setId(option.key);
      setSelectedStudent(null);
    };

    const handleStudentChange = (value, option) => {
      setSelectedStudent(value);
      setId(option.key);
      setSelectedTeacher(null);
    };

    return (
      <>
        <h1>{String(mode)}</h1>
        <p>Nombre del Profesor</p>
        <Select
          showSearch
          style={{ width: 280 }}
          placeholder="Nombre del Profesor"
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          onChange={handleTeacherChange}
          value={selectedTeacher}
          disabled={selectedStudent !== null}
        >
          {teachers.map(teacher => (
            <Select.Option key={teacher.id} value={teacher.id}>{teacher.name}</Select.Option>
          ))}
        </Select>
        <p>Nombre del Estudiante</p>
        <Select
          showSearch
          style={{ width: 280 }}
          placeholder="Nombre del Estudiante"
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          onChange={handleStudentChange}
          value={selectedStudent}
          disabled={selectedTeacher !== null}
        >
          {students.map(student => (
            <Select.Option key={student.id} value={student.id}>{student.name}</Select.Option>
          ))}
        </Select>
      </>
    );
  };

  const onDelete = async (id, deleteType) => {
    try {
      if (deleteType === 'student') {
        await groupEnrolementService.unAssignStudentToGroup(id, localStorage.getItem("groupsId"));
        message.success('Estudiante eliminado correctamente');
        getStudents();
        getStudentInGroup();

      } else {
        await teacherGroupService.unAssignTeacherToGroup(id, localStorage.getItem("groupsId"));

        message.success('Profesor eliminado correctamente');
        getTeachers();
        getTeachersInGroup();
      }
    } catch (error) {
      message.error('No se pudo eliminar al usuario del grupo');
    }
  }

  const onSubmit = async () => {
    try {
      if (selectedStudent) {
        await groupEnrolementService.assignStudentToGroup(Id, localStorage.getItem("groupsId"))

        getStudents();
        getStudentInGroup();


        message.success('Estudiante asignado correctamente');
      } else {
        await teacherGroupService.assignTeacherToGroup(Id, localStorage.getItem("groupsId"));

        getTeachers();
        getTeachersInGroup();

        message.success('Profesor asignado correctamente');
      }
    } catch (error) {
      console.log(error.message)
      message.error('No se pudo asignar al usuario')
    } finally {
      setSelectedTeacher(null);
      setSelectedStudent(null);
    }
  }

  const Cancel = () => {
    setMode(Consts.ADD_MODE);
  }

  const handleSearchstudents = (filteredData) => {
    setFilteredStudents(filteredData)
  };
  const handleSearchteachers = (filteredData) => {
    setFilteredTeacher(filteredData)
  };

  return (
    <div className='container admincourse-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name={localStorage.getItem('groupsName')} color={'#FF704A'} />
        <h2 className='list-titles'>Profesores</h2>
        <SearchComponent data={teachersInGroup} onSearch={handleSearchteachers} fieldName="name" />
        <BasicList items={filteredTeacher} renderRow={renderStudentsRow} Headlines={Headlines} onDelete={(itemId) => onDelete(itemId, 'teacher')} ></BasicList>
        <h2 className='list-titles'>Estudiantes</h2>
        <SearchComponent data={studentsInGroup} onSearch={handleSearchstudents} fieldName="name" />
        <BasicList items={filteredStudents} renderRow={renderTeachersRow} Headlines={Headlines} onDelete={(itemId) => onDelete(itemId, 'student')} ></BasicList>
        <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} />
        <FloatingExcelButton
          data={[
            { sheetTitle: 'profesores', content: teachersInGroup },
            { sheetTitle: 'estudiantes', content: studentsInGroup },
          ]}
          name={`estudiantes_profesores - ${localStorage.getItem('groupsName')} - ${localStorage.getItem('schoolName')}`}
        />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
      </div>
    </div>
  );

}

export default AdminCourse;
