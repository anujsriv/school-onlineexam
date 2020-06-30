import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import './AnswerPapers.css';

function AnswerTable(props) {

    const [questionPapers, setQuestionPapers] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const payload={
            "className" : props.location.state.className,
            "section": props.location.state.section
        }
        const response = await axios.post(API_BASE_URL+'questionpapers/', payload);
        setQuestionPapers(response.data);
    }

    const startExam = (id) => {
        const payload={
            "questionPaperID":id,
            "studentID":props.location.state.id
        }

        redirectToStartExam(payload);
    }

    const redirectToStartExam = (data) => {
        props.history.push('/studentstartexam', data);
    }

    const renderHeader = () => {
        let headerElement = ['id', 'subject', 'duration (mins)', 'full marks', 'status', 'action']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return questionPapers && questionPapers.map(({ id, subject, duration, fullMarks, status}) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{subject}</td>
                    <td>{duration}</td>
                    <td>{fullMarks}</td>
                    <td>{status}</td>
                    <td className='opration'>
                        <button className='button' title='Click to Start the Exam.' onClick={() => startExam(id)}>Take Exam</button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <h5 id='title'>To Start an exam click the <button className='button'>Take Exam</button> button. Please note that clicking on <button className='button'>Take Exam</button> will start your exam in a new Window.<br></br>Please DO NOT close or refresh the new window during the entirity of the exam.</h5>
            <table id='answerPaper'>
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

export default withRouter(AnswerTable);