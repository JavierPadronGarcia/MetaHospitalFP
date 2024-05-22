import React, { useState, useEffect } from 'react';
import BasicList from '../../../components/basiclist/basiclist';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import { Button, message, Select } from 'antd';
import { Consts } from '../../../constants/modes';
import PopForm from '../../../components/popform/popform';
import Tag from '../../../components/tag/tag';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import teacherGroupService from '../../../services/teacherGroup.service';
import groupEnrolementService from '../../../services/groupEnrolement.service';
import Menu2 from '../../../components/menu2/menu2';
import './admincourse.css';
import SearchComponent from '../../../components/search/search';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';
import useNotification from '../../../utils/shared/errorHandler';
import { useTranslation } from 'react-i18next';

function AdminCourse() {
  const [t] = useTranslation('global');
  const navigate = useNavigate();
  const {
    teacherCreateSuccessful,
    teacherDeleteSuccessful,
    studentCreateSuccessful,
    studentDeleteSuccessful,
    userDeleteFailed,
    userUpdateOrCreateFail
  } = useNotification();

  const [teachers, setTeachers] = useState([]);
  const [teachersInGroup, setTeachersInGroup] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsInGroup, setStudentsInGroup] = useState([]);
  const [Id, setId] = useState('');
  const Headlines = [t('name_s')];
  const [mode, setMode] = useState(Consts.ADD_MODE);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredTeacher, setFilteredTeacher] = useState([]);

  const columnTypes = [{
    type: {
      1: 'string',
    }, name: {
      1: 'name',
    }
  }];

  useEffect(() => {
    getTeachers();
    getTeachersInGroup();
    getStudents();
    getStudentInGroup();
  }, []);

  const getTeachers = async () => {
    try {
      const teacherlist = await teacherGroupService.getAllTeachersNotInAGroup(localStorage.getItem("groupsId"));
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
      const studentslist = await groupEnrolementService.getAllStudentsNotInAGroup(localStorage.getItem("groupsId"));
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
        <h1>{getTranslation(String(mode))}</h1>
        <p>{t('teacher_name')}</p>
        <Select
          showSearch
          style={{ width: 280 }}
          placeholder={t('teacher_name')}
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
        <p>{t('student_name')}</p>
        <Select
          showSearch
          style={{ width: 280 }}
          placeholder={t('student_name')}
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
        studentDeleteSuccessful();
        getStudents();
        getStudentInGroup();

      } else {
        await teacherGroupService.unAssignTeacherToGroup(id, localStorage.getItem("groupsId"));

        teacherDeleteSuccessful();
        getTeachers();
        getTeachersInGroup();
      }
    } catch (error) {
      userDeleteFailed();
    }
  }

  const onSubmit = async () => {
    try {
      if (selectedStudent) {
        await groupEnrolementService.assignStudentToGroup(Id, localStorage.getItem("groupsId"))

        getStudents();
        getStudentInGroup();


        studentCreateSuccessful();
      } else {
        await teacherGroupService.assignTeacherToGroup(Id, localStorage.getItem("groupsId"));

        getTeachers();
        getTeachersInGroup();

        teacherCreateSuccessful();
      }
    } catch (error) {
      console.log(error.message)
      userUpdateOrCreateFail();
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
        <Tag
          name={localStorage.getItem('groupsName')}
          color={'#FF704A'}
          leftButton={() => <Button type='primary' onClick={() => navigate('/admin/groupsgrades')} shape='round'>{t('student_grades')}</Button>}
        />
        <h2 className='list-titles'>{t('teacher_p')}</h2>
        <SearchComponent data={teachersInGroup} onSearch={handleSearchteachers} fieldName="name" />
        <BasicList items={filteredTeacher} renderRow={renderStudentsRow} Headlines={Headlines} onDelete={(itemId) => onDelete(itemId, 'teacher')} ></BasicList>
        <h2 className='list-titles'>{t('student_p')}</h2>
        <SearchComponent data={studentsInGroup} onSearch={handleSearchstudents} fieldName="name" />
        <BasicList items={filteredStudents} renderRow={renderTeachersRow} Headlines={Headlines} onDelete={(itemId) => onDelete(itemId, 'student')} columnTypes={columnTypes} ></BasicList>
        <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} />
        <FloatingExcelButton
          data={[
            { sheetTitle: t('teacher_p'), content: teachersInGroup },
            { sheetTitle: t('student_p'), content: studentsInGroup },
          ]}
          manySheets={true}
          name={`${t('student_p')}_${t('teacher_p')} - ${localStorage.getItem('groupsName')} - ${localStorage.getItem('schoolName')}`}
        />
      </div>
      <div className='container-right'>
        <Rightmenu renderImputs={renderSchoolImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={'/admin/courses'} />
      </div>
    </div>
  );

}

export default AdminCourse;
