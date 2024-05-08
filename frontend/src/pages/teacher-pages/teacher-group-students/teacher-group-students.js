import React, { useState, useEffect } from 'react';
import Headers from '../../../components/headers/headers';
import BasicList from '../../../components/basiclist/basiclist';
import PopForm from '../../../components/popform/popform';
import groupEnrolementService from '../../../services/groupEnrolement.service';
import { Select, message, notification } from 'antd';
import { useParams } from 'react-router-dom';
import { Consts } from '../../../constants/modes';
import authService from '../../../services/auth.service';

const TeacherGroupStudents = () => {
    const { id, name } = useParams();
    const [students, setStudents] = useState([]);
    const [mode, setMode] = useState(Consts.ADD_MODE);
    const [studentsInGroup, setstudentsInGroup] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const Headlines = ['Nombre', 'Codigo'];
    const [filteredData, setFilteredData] = useState([]);

    const getStudents = async () => {
        try {
            const response = await groupEnrolementService.getAllStudentsNotInAGroup();
            setStudents(response)
        } catch (err) {
            console.log('Error:', err);
        }
    }

    const columnTypes = [{
        type: {
          1: 'string',
        }, name: {
          1: 'name',
        }
      }];

    const getStudentsInGroup = async () => {
        try {
            const studentslist = await groupEnrolementService.getAllStudentsInAGroup(id);
            console.log(studentslist);
            setstudentsInGroup(studentslist);
            setFilteredData(studentslist);
        } catch (err) {
            console.log('Error:', err);
        }
    }

    useEffect(() => {
        getStudentsInGroup();
        console.log(studentsInGroup);
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
            <td>{student.UserAccount.code}</td>
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

    const onEdit = async (studentId) => {
        try {
            await authService.resetPassword(studentId);
            message.success('La contraseña del estudiante ha sido reestablecida');
        } catch (error) {
            console.log(error);
            message.error("Error al restablecer la contraseña del estudiante");
        }
    }

    const handleSearch = (filteredData) => {
        setFilteredData(filteredData);
    };

    return (
        <div>
            <Headers title={name} Page={'selected'} groupData={{ groupId: id, groupName: name }} data={studentsInGroup} onSearch={handleSearch} fieldName="name" />
            <BasicList items={filteredData} renderRow={renderStudentsRow} Headlines={Headlines} onDelete={onDelete} onEdit={onEdit} password={true} columnTypes={columnTypes} />
            <PopForm renderInputs={renderSchoolInputs} onSubmit={onSubmit} cancel={Cancel} />
        </div>
    );
}

export default TeacherGroupStudents;
