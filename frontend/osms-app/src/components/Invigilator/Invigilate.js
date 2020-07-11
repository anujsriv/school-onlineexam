import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import './Invigilate.css';
import WebCam from '../Images/webcam-icon.png';

function Invigilate(props) {

    const [students, setStudents] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get(API_BASE_URL+'answerpapers/'+props.location.state.questionPaperID);
        setStudents(response.data);
    }

    const renderHeader = () => {
        let headerElement = ['id', 'Name', 'class', 'section', 'status', 'view camera']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        console.log(students);
        return students && students.map(({ id, fullName, className, section, loggedIn}) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{fullName}</td>
                    <td>{className}</td>
                    <td>{section}</td>
                    <td>{loggedIn}</td>
                    <td className='opration'><img src={WebCam} width="30" height="40" />
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <h5 id='title'>Following people are taking the Exam !</h5>
            <table id='students'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </>
    )
}

export default withRouter(Invigilate);
