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

    const deleteData = (id) => {

        axios.delete(`${API_BASE_URL}/${id}`).then(res => {
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
                        <button className='button' title='Click to edit this Question Paper or add/ remove questions from it.' onClick={() => editData(id)}>Edit</button>
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