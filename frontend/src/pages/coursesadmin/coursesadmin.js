import React, { useState, useEffect } from 'react';
import BasicList from '../../components/basiclist/basiclist';
import CoursesService from '../../services/courses.service';
import Menu2 from '../../components/menu2/menu2';
import Rightmenu from '../../components/rightmenu/rightmenu';
import { Input, message } from 'antd';
import Consts from '../../components/consts/consts';
import PopForm from '../../components/popform/popform';
import Tag from '../../components/tag/tag';
import { useLocation } from 'react-router-dom';

function CoursesAdmin() {
    const [Courses, setCourses] = useState([]);
    const [name, setName] = useState('');
    const [acronyms, setAcronyms] = useState('');
    const [Id, setId] = useState('');
    const Headlines = ['Nombre', 'Acrónimo'];
    const [mode, setMode] = useState(Consts.ADD_MODE);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const location = useLocation(); 

    const getCourses = async () => {
        try {
            const response = await CoursesService.getCourses();
            const coursesList = response;
            setCourses(coursesList);
        } catch (error) {
            message.error({
                content: error,
            });
        }
    };

    useEffect(() => {

        getCourses();

        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };

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
            <p>Name</p>
            <Input placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)} />
            <p>Acronyms</p>
            <Input placeholder="Acronyms"
                value={acronyms}
                onChange={(e) => setAcronyms(e.target.value)} />
        </>
    );

    const onDelete = async (id) => {
        try {
            await CoursesService.deleteCourse(id);
            getCourses();
            console.log('courses deleted successfully');
        } catch (error) {
            message.error({
                content: error,
            });
        }
    }

    const Edit = (id) => {
        const coursesToEdit = Courses.find(courses => courses.id === id);

        setId(id);

        setName(coursesToEdit.name);
        setAcronyms(coursesToEdit.acronyms);
        setMode(Consts.EDIT_MODE);
    }

    const onSubmit = async () => {
        try {
            if (mode === Consts.EDIT_MODE) {
                const coursesToEdit = Courses.find(courses => courses.id === Id);

                coursesToEdit.name = name;
                coursesToEdit.acronyms = acronyms;

                await CoursesService.updateCourse( Id, coursesToEdit);

                console.log('courses updated successfully');
                getCourses();
            } else {
                const courses = {
                    name: name,
                    acronyms: acronyms,
                };

                await CoursesService.createNewCourse(courses);
                getCourses();
                console.log('New courses created successfully');
            }
        } catch (error) {
            message.error(error+ ' error al crear curso');
        }
    }

    const Cancel = () => {
        setMode(Consts.ADD_MODE);
        setName('');
        setAcronyms('');
    }

    return (
        <div className='container'>
            <div className='container-left'>
                <Menu2 />
                <Tag name="Cursos" />
                <BasicList items={Courses} renderRow={rendercoursesRow} Headlines={Headlines} onDelete={onDelete} onEdit={Edit}></BasicList>
                {isSmallScreen && <PopForm renderInputs={renderCoursesImputs} cancel={Cancel} onSubmit={onSubmit} showModalAutomatically={mode === Consts.EDIT_MODE} />}
            </div>
            {!isSmallScreen && <div className='container-right'>
                <Rightmenu renderImputs={renderCoursesImputs} cancel={Cancel} mode={mode} onSubmit={onSubmit} currentRoute={location.pathname} />
            </div>}
        </div>
    );

}

export default CoursesAdmin;