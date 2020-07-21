import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import './Invigilate.css';
import WebCamIcon from '../Images/webcam-icon.png';
import EvaluateIcon from '../Images/evaluate.png';
import Bulb from 'react-bulb';
import UserProfile from '../../closure/UserProfile';

function Invigilate(props) {

    const [students, setStudents] = useState([]);

    const [student, setStudent] = useState({});

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get(API_BASE_URL+'answerpapers/'+props.location.state.questionPaperID);
        setStudents(response.data);
    }

    const renderHeader = () => {
        let headerElement = ['id', 'Name', 'class', 'section', 'status']
        let headerElementEvaluate = ['id', 'Name', 'class', 'section', 'action']

        if (props.location.state.action === 'evaluate') {
            return headerElementEvaluate.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            })
        }

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const startFeedAll = () => {
        let userName = UserProfile.getUserName();
        axios.get(API_BASE_URL+'procting/'+userName)
            .then(function (response){
                if (response.status === 200) {
                    const proctingURL = response.data.videoURL;
                    window.open(proctingURL, "_blank");
                }
            })
            .catch(function (error) {
                console.log(error);
        })
    }

    const saveMarks = () => {
        
    }

    const getStudentAndAnswerDetails = (id) => {

        let questionArray = [];
        let answerArray = [];
        let modifiedQuestionArray = [];
        let anspaperID = 0;

        students.forEach(eachStudent => {
            if (eachStudent.id === id) {
                setStudent(eachStudent);
            }
        })

        axios.get(API_BASE_URL+'question/'+props.location.state.questionPaperID)
            .then(questionsResponse => {
                if (questionsResponse.status === 200) {
                    questionArray = questionsResponse.data;
                }
            })
            .catch(function (error){
                console.log(error);
        })

        axios.get(API_BASE_URL+'answerpapers/'+props.location.state.questionPaperID+'/'+id)
            .then(answerPaperResponse => {
                if (answerPaperResponse.status === 200) {
                    anspaperID = answerPaperResponse.data.id;

                    axios.get(API_BASE_URL+'answers/'+anspaperID)
                        .then(response => {
                            if (response.status === 200) {
                                answerArray = response.data;

                                questionArray && questionArray.forEach(eachQuestion => {
                                    answerArray && answerArray.forEach(eachAnswer => {
                                        if (eachAnswer.questionID === eachQuestion.id) {
                                            const qa = {
                                                "question": eachQuestion.question,
                                                "answer": eachAnswer.answer,
                                                "marks": eachQuestion.marks,
                                                "id": eachAnswer.id
                                            }
                                            modifiedQuestionArray.push(qa);
                                        }
                                    })
                                })
                        
                                setQuestions(modifiedQuestionArray);
                            }
                    })
                    .catch(function (error){
                        console.log(error);
                    })
                }    
            })
            .catch(function (error){
                console.log(error);
        })
    }

    const renderQAList = () => {
        return questions && questions.map(function (eachQuestion) {
            return (
                <li className="list-group-item text-left" key={eachQuestion.id}>
                    <label className="font-weight-bold">Question</label>
                    <br></br>
                    <label className="font-weight-normal">{eachQuestion.question}</label>
                    <br></br>
                    <label className="font-weight-bold">Answer</label>
                    <br></br>
                    <label className="font-weight-normal">{eachQuestion.answer}</label>
                    <br></br>
                    <form class="form-inline">
                        <label className="font-weight-bold">Evaluation : </label>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="customRadioInline1" name="customRadioInline1" className="custom-control-input" />
                            <label className="custom-control-label" htmlFor="customRadioInline1">Correct</label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input" />
                            <label className="custom-control-label" htmlFor="customRadioInline2">Incorrect</label>
                        </div>
                        <label className="font-weight-bold">Marks: </label>
                        <div className="form-group mx-sm-2 mb-2">
                            <input type="text" id="marksObtained" placeholder="Marks" />
                        </div>
                        <label className="font-weight-bold">Total Marks : {eachQuestion.marks}</label>
                    </form>
                </li>
            )
        });
    }

    const renderBody = () => {
        return students && students.map(({ id, fullName, className, section, loggedIn}) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{fullName}</td>
                    <td>{className}</td>
                    <td>{section}</td>
                    {props.location.state.action === 'evaluate' ?
                    <td>
                        <img src={EvaluateIcon} alt='' width="30" height="30" data-toggle="modal" data-target="#exampleModalLong" onClick={() => getStudentAndAnswerDetails(id)} title="Click here to evaluate this Answer Sheet." />
                    </td>
                    : <td>{loggedIn ? <Bulb size={10} color="green"/> : <Bulb size={10} color="red"/> }</td>
                    }
                </tr>
            )
        })
    }

    return (
        <>
            {props.location.state.action === 'evaluate' ? 
                <h5 id='title'>Following people have completed the Exam</h5>
                : <div> <h5 id='title'>Following people are taking the Exam</h5>
                        <img src={WebCamIcon} alt='' width="30" height="40" onClick={() => startFeedAll()} title="Click here to see student's feed." />
                  </div>
            }
            <table id='students'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
            <div className="modal fade bd-example-modal-lg" id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Name: {student.fullName} </h5>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group list-group-flush">
                            {renderQAList()}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={() => {saveMarks()}}>Save Changes</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withRouter(Invigilate);
