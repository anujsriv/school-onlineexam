import React, { useState, useEffect } from 'react';
import axios from '../CustomAxios/Axios';
import { withRouter } from "react-router-dom";
import './QuestionPapers.css';
import UserProfile from '../../closure/UserProfile';

function QuestionTable (props) {
    
    const [questionPapers, setQuestionPapers] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get('questionpapers/'+props.location.state.id);
        setQuestionPapers(response.data);
    }

    const editData = (id) => {
    }

    const startExam = (id) => {
        axios.get('questionpaper/'+id).then(response => {
            let newQuestion = response.data;
            newQuestion.status = 'Started';
            axios.put('questionpaper/'+id, newQuestion).then(res => {
                axios.get('questionpapers/'+props.location.state.id).then(response =>{
                    setQuestionPapers(response.data);
                });
            });
            
            let className = newQuestion.className;
            let section = newQuestion.section;

            const teacherPayload = {
                "className": className,
                "section": section,
                "userName": UserProfile.getUserName()
            }

            axios.post('procting', teacherPayload)
                .then(function (response){
                    if (response.status === 200) {
                        console.log("Teacher Procting URL Generated.");
                    }
                })
                .catch(function (error){
                    console.log(error);
            })

            axios.get('users/'+className+'/'+section)
                .then(function (response) {
                    if (response.status === 200) {
                        const students = response.data;
                        students.forEach(eachStudent => {
                            const payload = {
                                "className": eachStudent.className,
                                "section": eachStudent.section,
                                "userName": eachStudent.userName
                            }

                            axios.post('procting', payload)
                                .then(function (response){
                                    if (response.status === 200) {
                                        console.log("Procting URL Generated.");
                                    }
                                })
                                .catch(function (error){
                                    console.log(error);
                                })
                        })
                    }
                })
                .catch(function (error){
                    console.log(error);
            });
        });
    }

    const stopExam = (id) => {
        axios.get('questionpaper/'+id).then(response => {
            let newQuestion = response.data;
            newQuestion.status = 'Stopped';
            axios.put('questionpaper/'+id, newQuestion).then(res => {
                axios.get('questionpapers/'+props.location.state.id).then(response =>{
                    setQuestionPapers(response.data);
                });
            });

            let className = newQuestion.className;
            let section = newQuestion.section;

            axios.delete('procting/'+className+'/'+section)
                .then(function (response) {
                    if (response.status === 200) {
                        console.log("Procting URL removed.");
                    }
                })
                .catch(function (error){
                    console.log(error);
                })
        });
    }

    const invigilateExam = (id) => {
        const payload = {
            "questionPaperID": id,
            "teacherID": props.location.state.id,
            "action": 'invigilate'
        }

        props.history.push('/invigilation', payload);
    }

    const evaluateExam = (id) => {
        const payload = {
            "questionPaperID": id,
            "teacherID": props.location.state.id,
            "action": 'evaluate'
        }

        props.history.push('/invigilation', payload);
    }

    const deleteData = (id) => {
        axios.delete('questionpaper/'+id).then(res => {
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

    const renderButtons = (status, id) => {
        if (status === 'Started') {
            return (
                <div className="btn-group" role="group" aria-label="Action Buttons">
                    <button className='button btn-outline-success' title='Click here to start monitoring the Exam.' onClick={() => invigilateExam(id)}>Invigilate</button> | 
                    <button className='button btn-outline-warning' title='Click here to stop the Exam.' onClick={() => stopExam(id)}>Stop</button>
                </div>
            )
        }

        if (status === 'Stopped') {
            return (
                <div className="btn-group" role="group" aria-label="Action Buttons">
                    <button className='button' title='Click here to start monitoring the Exam.' onClick={() => evaluateExam(id)}>Evaluate</button>
                </div>
            )
        }

        if (status === 'Created') {
            return (
                <div className="btn-group" role="group" aria-label="Action Buttons">
                    <button className='button' title='Click here to edit this Question Paper or add/ remove questions from it.' onClick={() => editData(id)}>Edit</button> |
                    <button className='button' title='Click here to delete this Question Paper.' onClick={() => deleteData(id)}>Delete</button> | 
                    <button className='button' title='Click here to start the Exam.' onClick={() => startExam(id)}>Start</button>
                </div>
            )
        }

        if (status === 'Complete') {
            return (
                <div className="btn-group" role="group" aria-label="Action Buttons">
                    Paper has ended.
                </div>
            )
        }
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
                        {renderButtons(status, id)}
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