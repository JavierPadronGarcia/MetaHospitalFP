import React, { useState, useEffect } from 'react';
import BasicList from '../../components/basiclist/basiclist';
import Rightmenu from '../../components/rightmenu/rightmenu';
import { message, Select } from 'antd';
import Consts from '../../components/consts/consts';
import PopForm from '../../components/popform/popform';
import Tag from '../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import teacherGroupService from '../../services/teacherGroup.service';
import groupEnrolementService from '../../services/groupEnrolement.service';
import Menu2 from '../../components/menu2/menu2';

function AdminCourse() {
    const [teachers, setTeachers] = useState([]);
    const [teachersInGroup, setTeachersInGroup] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentsInGroup, setStudentsInGroup] = useState([]);
    const [name, setName] = useState('');
    const [Id, setId] = useState('');
    const Headlines = ['Nombre'];
    const [mode, setMode] = useState(Consts.ADD_MODE);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const location = useLocation();
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const getTeachers = async () => {
        try {
            const response = await teacherGroupService.getAllTeachersNotInAGroup();
            const teacherlist = response;
            setTeachers(teacherlist);
        } catch (error) {
            console.error('Error fetching schools:', error);
            message.error(error.message)
        }
    };

    const getTeachersInGroup = async () => {
        try {
            const response = await teacherGroupService.getAllTeachersInAGroup(localStorage.getItem("groupsId"));
            const teacherlist = response.map(teacher => teacher.User);
            setTeachersInGroup(teacherlist);
        } catch (error) {
            console.error('Error fetching schools:', error);
            message.error(error.message)
        }
    };

    const getStudents = async () => {
        try {
            const response = await groupEnrolementService.getAllStudentsNotInAGroup();
            const studentslist = response;
            setStudents(studentslist);
        } catch (error) {
            console.error('Error fetching schools:', error);
            message.error(error.message)
        }
    };

    const getStudentInGroup = async () => {
        try {
            const response = await groupEnrolementService.getAllStudentsInAGroup( localStorage.getItem("groupsId") );
            const studentslist = response.map(student => student.User);
            setStudentsInGroup(studentslist);
        } catch (error) {
            console.error('Error fetching schools:', error);
            message.error(error.message)
        }
    };


    useEffect(() => {

        getTeachers();

        getTeachersInGroup();

        getStudents();

        getStudentInGroup();

        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);


    const renderSchoolRow = (student) => (
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
                    disabled={selectedTeacher !== null} // Bloquea si se seleccionó un profesor
                >
                    {students.map(student => (
                        <Select.Option key={student.id} value={student.id}>{student.name}</Select.Option>
                    ))}
                </Select>
            </>
        );
    };

    const onDelete = async (id) => {
        try {
            if (selectedStudent) {
                await groupEnrolementService.unAssignStudentToGroup(id, localStorage.getItem("groupsId"));

                getTeachers();

                getTeachersInGroup();

                console.log('school deleted successfully');
            } else {
                await teacherGroupService.unAssignTeacherToGroup(id, localStorage.getItem("groupsId"));

                getTeachers();

                getTeachersInGroup();

                console.log('school deleted successfully');
            }
        } catch (error) {
            console.error('Error delete school:', error);
            message.error(error.message);
        }
    }

    const onSubmit = async () => {
        try {
            if (selectedStudent) {
                await groupEnrolementService.assignStudentToGroup(Id, localStorage.getItem("groupsId"))

                getStudents();

                getStudentInGroup();

                console.log('New school created successfully');
                message.success('New school created successfully')
            } else {
                await teacherGroupService.assignTeacherToGroup(Id, localStorage.getItem("groupsId"));

                getTeachers();

                getTeachersInGroup();

                console.log('New school created successfully');
                message.success('New school created successfully')
            }
        } catch (error) {
            console.error('Error updating/creating school:', error);
            message.error(error.message)
        } finally {
            setSelectedTeacher(null);
            setSelectedStudent(null);
        }
    }

    const Cancel = () => {
        setMode(Consts.ADD_MODE);
        setName('');
    }

    return (
        <div className='container'>
            <div className='container-left'>
                <Menu2></Menu2>
                <Tag name={localStorage.getItem('groupsName')} color={'#FF704A'} />
                <h2 className='list-titles'>Profesores</h2>
                <BasicList items={teachersInGroup} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} ></BasicList>
                <h2 className='list-titles'>Estudiantes</h2>
                <BasicList items={studentsInGroup} renderRow={renderTeachersRow} Headlines={Headlines} onDelete={onDelete} ></BasicList>
                {isSmallScreen && <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={mode === Consts.EDIT_MODE} />}
            </div>
            {!isSmallScreen && <div className='container-right'>
                <Rightmenu renderImputs={renderSchoolImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
            </div>}
        </div>
    );

}

export default AdminCourse;
