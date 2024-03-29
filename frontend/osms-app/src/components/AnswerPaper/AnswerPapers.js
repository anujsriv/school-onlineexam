import React, { useState, useEffect } from 'react';
import axios from '../CustomAxios/Axios';
import { withRouter } from "react-router-dom";
import './AnswerPapers.css';

function AnswerTable(props) {

    const [questionPapers, setQuestionPapers] = useState([]);

    const [state, setState] = useState({
        successMessage: null
    })

    useEffect(() => {
        getData()
        const interval = setInterval(() => {
            getData()
          }, 10000);
          return () => clearInterval(interval);
    }, [])

    const getData = async () => {
        const payload={
            "className" : props.location.state.className,
            "section": props.location.state.section
        }
        const response = await axios.post('questionpapers/', payload);
        setQuestionPapers(response.data);
    }

    const startExam = (id) => {
        const payload={
            "questionPaperID":id,
            "studentID":props.location.state.id
        }
        axios.get('answerpapers/'+id+'/'+props.location.state.id)
            .then(function (response) {
                if (response.status === 200) {
                    setState({
                        'successMessage' : 'You have already attempted this Exam/ Paper.'
                    });
                } else {
                    redirectToStartExam(payload);
                }
            })
            .catch(function (error) {
                console.log(error);
                redirectToStartExam(payload);
            });
    }

    const redirectToStartExam = (data) => {
        props.history.push('/studentstartexam', data);
    }

    const renderHeader = () => {
        let headerElement = ['#', 'subject', 'duration (mins)', 'full marks', 'action']

        return headerElement.map((key, index) => {
            return <th scope="col" key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return questionPapers && questionPapers.map(({ id, subject, duration, fullMarks}) => {
            return (
                <tr key={id}>
                    <th scope="row">{id}</th>
                    <td>{subject}</td>
                    <td>{duration}</td>
                    <td>{fullMarks}</td>
                    <td className='opration'>
                        <button className='button' title='Click to Start the Exam.' onClick={() => startExam(id)}>Take Exam</button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <h5 id='title'>To Start an exam click the <label style={{cursor: 'auto'}} className='button'>Take Exam</label> button. Please note that clicking on <label style={{cursor: 'auto'}} className='button'>Take Exam</label> will start your exam in a new Window.<br></br>Please DO NOT close or refresh the new window during the entirety of the exam.</h5>
            <div className="card-body text-center">
                <h4 />
                <table className="table table-hover">
                    <thead>
                        <tr className="table-primary">{renderHeader()}</tr>
                    </thead>
                    <tbody>
                        {renderBody()}
                    </tbody>
                </table>
            </div>
            <div className="alert alert-success" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
        </>
    )
}

export default withRouter(AnswerTable);