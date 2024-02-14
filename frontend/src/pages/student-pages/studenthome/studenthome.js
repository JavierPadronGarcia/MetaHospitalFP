import React, { useEffect, useState } from 'react';
import Card from '../../../components/card/card';
import Headers from '../../../components/headers/headers';
import groupsService from '../../../services/groups.service';
import Tag from '../../../components/tag/tag';
import { jwtDecode } from 'jwt-decode';
import './studenthome.css'
import CardUnits from '../../../components/cardUnits/cardunits';


const Studenthome = () => {
    const  [title, setTitle] = useState('');

    const getGroup = async  () =>{
        try {
            const token = localStorage.getItem('token');
            const tokenDecoded = jwtDecode(token);
            let response = await groupsService.getById(3);
            console.log('response');
        } catch (error) {
           console.log("Error: ", error);
        };
    };

    useEffect(()=>{
       getGroup();
       console.log('se obtuvo');
    }, []);

    return (
        <div  className="student-home">
            <Headers title={title} groupId={3}/>
            <div className='container-scloll'>
                <Tag name="Unidades" className="tags"/>
                <CardUnits title={'Unidad 1'}/>
            </div>
        </div>
    );
}

export default Studenthome;