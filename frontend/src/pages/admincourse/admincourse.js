import React, { useState, useEffect } from 'react';
import BasicList from '../../components/basiclist/basiclist';
import Menu from '../../components/menu/menu';
import Rightmenu from '../../components/rightmenu/rightmenu';
import { Input, message, Select } from 'antd';
import Consts from '../../components/consts/consts';
import { Link } from 'react-router-dom';
import PopForm from '../../components/popform/popform';
import Tag from '../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import teacherGroupService from '../../services/teacherGroup.service';

function AdminCourse() {
    const [teachers, setTeachers] = useState([]);
    const [teachersInGroup, setTeachersInGroup] = useState([]);
    const [name, setName] = useState('');
    const [Id, setId] = useState('');
    const Headlines = ['Nombre'];
    const [mode, setMode] = useState(Consts.ADD_MODE);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const location = useLocation();

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
            const response = await teacherGroupService.getAllTeachersInAGroup(3);
            const teacherlist = response;
            setTeachers(teacherlist);
        } catch (error) {
            console.error('Error fetching schools:', error);
            message.error(error.message)
        }
    };

    useEffect(() => {

        getTeachers();

        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);


    const renderSchoolRow = (school) => (
        <>
            <td>{school.name}</td>
        </>
    );

    const renderSchoolImputs = () => (
        <>
            <h1>{String(mode)}</h1>
            <p>Name Teacher</p>
            <Select
                showSearch
                style={{ width: 280 }}
                placeholder="Name Teacher"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                onChange={(value) => setName(value)}
            >
                {teachers.map(teacher => (
                    <Select.Option key={teacher.id} value={teacher.name}>{teacher.name}</Select.Option>
                ))}
            </Select>
            <p>Name Student</p>
            <Select
                showSearch
                style={{ width: 280 }}
                placeholder="Name Student"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                onChange={(value) => setName(value)}
            >
                {teachers.map(teacher => (
                    <Select.Option key={teacher.id} value={teacher.name}>{teacher.name}</Select.Option>
                ))}
            </Select>
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
        <div className='container'>
            <div className='container-left'>
                <Menu />
                <Tag name='Escuelas' color={'#FF704A'} />
                <h2 className='list-titles'>Profesores</h2>
                <BasicList items={Schools} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
                <h2 className='list-titles'>Estudiantes</h2>
                <BasicList items={Schools} renderRow={renderSchoolRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
                {isSmallScreen && <PopForm renderInputs={renderSchoolImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={mode === Consts.EDIT_MODE} />}
            </div>
            {!isSmallScreen && <div className='container-right'>
                <Rightmenu renderImputs={renderSchoolImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
            </div>}
        </div>
    );

}

export default AdminCourse;