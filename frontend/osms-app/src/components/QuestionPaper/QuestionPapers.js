import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import './QuestionPapers.css';

function QuestionTable (props) {
    
    const [questionPapers, setQuestionPapers] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get(API_BASE_URL+'questionpapers/'+props.location.state.id);
        setQuestionPapers(response.data);
    }

    const editData = (id) => {
    }

    const startExam = (id) => {
        axios.get(API_BASE_URL+'questionpaper/'+id).then(response => {
            let newQuestion = response.data;
            newQuestion.status = 'Started';
            axios.put(API_BASE_URL+'questionpaper/'+id, newQuestion).then(res => {
                axios.get(API_BASE_URL+'questionpapers/'+props.location.state.id).then(response =>{
                    setQuestionPapers(response.data);
                });
            });
        });
    }

    const deleteData = (id) => {
        axios.delete(API_BASE_URL+'questionpaper/'+id).then(res => {
            const del = questionPapers.filter(questionPaper => id !== questionPaper.id)
            setQuestionPapers(del)
        })
    }

    const renderHeader = () => {
        let headerElement = ['id', 'subject', 'class', 'section', 'duration (mins)', 'full marks', 'status', 'action']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return questionPapers && questionPapers.map(({ id, subject, className, section, duration, fullMarks, status}) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{subject}</td>
                    <td>{className}</td>
                    <td>{section}</td>
                    <td>{duration}</td>
                    <td>{fullMarks}</td>
                    <td>{status}</td>
                    <td className='opration'>
                        <div class="btn-group" role="group" aria-label="Action Buttons">
                            <button className='button' title='Click here to edit this Question Paper or add/ remove questions from it.' onClick={() => editData(id)}>Edit</button> |
                            <button className='button' title='Click here to delete this Question Paper.' onClick={() => deleteData(id)}>Delete</button> |
                            <button className='button' title='Click here to start the Exam.' onClick={() => startExam(id)}>Start</button>
                        </div>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <h5 id='title'>Question Paper(s) set by You</h5>
            <table id='questionPaper'>
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

export default withRouter(QuestionTable);