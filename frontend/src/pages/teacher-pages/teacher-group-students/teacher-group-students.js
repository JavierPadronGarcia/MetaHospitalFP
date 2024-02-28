import React, { useState, useEffect } from 'react';
import './teacher-group-students.css'
import Headers from '../../../components/headers/headers';
import BasicList from '../../../components/basiclist/basiclist';
import PopForm from '../../../components/popform/popform';
import groupEnrolementService from '../../../services/groupEnrolement.service';
import { Select } from 'antd';
import { useParams } from 'react-router-dom';
import { Consts } from '../../../constants/modes';

const TeacherGroupStudents = () => {
    const { id, name } = useParams();
    const [students, setStudents] = useState([]);
    const [mode, setMode] = useState(Consts.ADD_MODE);
    const [studentsInGroup, setstudentsInGroup] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const Headlines = ['Nombre'];

    const getStudents = async () => {
        try {
            const response = await groupEnrolementService.getAllStudentsNotInAGroup();
            setStudents(response)
        } catch (err) {
            console.log('Error:', err);
        }
    }

    const getStudentsInGroup = async () => {
        try {
            const studentslist = await groupEnrolementService.getAllStudentsInAGroup(id)
            setstudentsInGroup(studentslist);
        } catch (err) {
            console.log('Error:', err);
        }
    }

    useEffect(() => {
        getStudentsInGroup();
        getStudents();
    }, []);

    const onDelete = async (Id) => {
        try {
            await groupEnrolementService.unAssignStudentToGroup(Id, id);

            getStudentsInGroup();
            getStudents();
        } catch (error) {
            console.error('Error delete school:', error);
        }
    }

    const onSubmit = async () => {
        try {
            await groupEnrolementService.assignStudentToGroup(selectedStudentId, id);

            getStudentsInGroup();
            getStudents();
        } catch (err) {
            console.log('Error:', err);
        }
    }

    const Cancel = () => {
        setMode(Consts.ADD_MODE);
    }

    const renderStudentsRow = (student) => (
        <>
            <td>{student.name}</td>
        </>
    );

    const renderSchoolInputs = () => {


        const handleStudentChange = (value, option) => {
            setSelectedStudent(value);
            setSelectedStudentId(option.key);
        };

        return (
            <>
                <h1>{String(mode)}</h1>
                <p>Estudiantes</p>
                <Select
                    showSearch
                    style={{ width: 280 }}
                    placeholder="Selecciona un estudiante"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onChange={handleStudentChange}
                    value={selectedStudent}
                >
                    {students.map(student => (
                        <Select.Option key={student.id} value={student.id}>{student.name}</Select.Option>
                    ))}
                </Select>
            </>
        );
    };


    return (
        <div>
            <Headers title={name} Page={'selected'} groupData={{ groupId: id, groupName: name }} />
            <BasicList items={studentsInGroup} renderRow={renderStudentsRow} Headlines={Headlines} onDelete={onDelete} />
            <PopForm renderInputs={renderSchoolInputs} onSubmit={onSubmit} cancel={Cancel} />
        </div>
    );
}

export default TeacherGroupStudents;
