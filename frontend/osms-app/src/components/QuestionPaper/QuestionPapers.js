import React, { useState, useEffect } from 'react';
import axios from '../CustomAxios/Axios';
import { withRouter } from "react-router-dom";
import UserProfile from '../../closure/UserProfile';
import EvaluateIcon from '../Images/evaluate.png';
import './QuestionPapers.css';
import ReactImageMagnify from 'react-image-magnify';

function QuestionTable (props) {

    const [students, setStudents] = useState([]);

    const [currentQuestionPaperID, setCurrentQuestionPaperID] = useState({});

    const [evaluated, setEvaluated] = useState(null);

    const [student, setStudent] = useState({});

    const [questions, setQuestions] = useState([]);
    
    const [questionPapers, setQuestionPapers] = useState([]);

    const [questionPaper, setQuestionPaper] = useState({});

    const [enlargeImage, setEnlargeImage] = useState(false);

    useEffect(() => {
        getData()
        const interval = setInterval(() => {
            getData()
          }, 10000);
          return () => clearInterval(interval);
    }, [])

    const getData = async () => {
        const response = await axios.get('questionpapers/'+props.location.state.id);
        setQuestionPapers(response.data);
    }

    const viewData = (id, edit) => {
        axios.get('question/'+id)
            .then(questionsResponse => {
                if (questionsResponse.status === 200) {
                    setQuestions(questionsResponse.data);
                }
            })
            .catch(function (error){
                console.log(error);
        })

        questionPapers.forEach(function (eachQuestionPaper){
            if (id === eachQuestionPaper.id) {
                setQuestionPaper(eachQuestionPaper);
            }
        })
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
                "userName": UserProfile.getUserName(),
                "userType": "teacher"
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
                                "userName": eachStudent.userName,
                                "userType": "student"
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
        let userName = UserProfile.getUserName();
        axios.get('procting/'+userName)
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

    const evaluateExam = (id) => {
        setCurrentQuestionPaperID(id);

        axios.get('answerpapers/'+id)
            .then(function (response){
                setStudents(response.data);
        })
    }

    const deleteData = () => {
        axios.delete('questionpaper/'+currentQuestionPaperID).then(res => {
            const del = questionPapers.filter(questionPaper => currentQuestionPaperID !== questionPaper.id)
            setQuestionPapers(del)
        })
        setCurrentQuestionPaperID();
    }

    const dontDeleteData = () => {
        setCurrentQuestionPaperID();
    }

    const renderHeader = () => {
        let headerElement = ['#', 'subject', 'class', 'section', 'duration (mins)', 'full marks', 'status', 'action']

        return headerElement.map((key, index) => {
            return <th scope="col" key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderButtons = (status, id) => {
        if (status === 'Started') {
            return (
                <div className="btn-group" role="group" aria-label="Action Buttons">
                    <button className='button' data-toggle="modal" data-target="#viewEditQuestions" title='Click here to edit this Question Paper or add/ remove questions from it.' onClick={() => viewData(id, 'false')}>View</button> |
                    <button className='button btn-outline-success' title='Click here to start monitoring the Exam.' onClick={() => invigilateExam(id)}>Invigilate</button> | 
                    <button className='button btn-outline-warning' title='Click here to stop the Exam.' onClick={() => stopExam(id)}>Stop</button>
                </div>
            )
        }

        if (status === 'Stopped') {
            return (
                <div className="btn-group" role="group" aria-label="Action Buttons">
                    <button className='button' data-toggle="modal" data-target="#viewEditQuestions" title='Click here to edit this Question Paper or add/ remove questions from it.' onClick={() => viewData(id, 'false')}>View</button> |
                    <button className='button' data-toggle="collapse" data-target="#studentList" onClick={() => evaluateExam(id)} title='Click here to start evaluate the Exam.'>Evaluate</button>
                </div>
            )
        }

        if (status === 'Created') {
            return (
                <div className="btn-group" role="group" aria-label="Action Buttons">
                    <button className='button' title='Click here to start the Exam.' onClick={() => startExam(id)}>Start</button> | 
                    <button className='button' data-toggle="modal" data-target="#viewEditQuestions" title='Click here to edit this Question Paper or add/ remove questions from it.' onClick={() => viewData(id, 'true')}>View</button> |
                    <button className='button' title='Click here to delete this Question Paper.' onClick={() => setCurrentQuestionPaperID(id)} data-toggle="modal" data-target="#deleteConfirm">Delete</button>
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
                <tr key={id} id={id}>
                    <th scope="row">{id}</th>
                    <td>{subject}</td>
                    <td>{className}</td>
                    <td>{section}</td>
                    <td>{duration}</td>
                    <td>{fullMarks}</td>
                    <td>{status}</td>
                    <td>
                        {renderButtons(status, id)}
                    </td>
                </tr>
            )
        })
    }

    const getStudentAndAnswerDetails = (id) => {

        setEvaluated(false);

        let questionArray = [];
        let answerArray = [];
        let modifiedQuestionArray = [];
        let anspaperID = 0;

        students.forEach(eachStudent => {
            if (eachStudent.id === id) {
                setStudent(eachStudent);
            }
        })

        axios.get('question/'+currentQuestionPaperID)
            .then(questionsResponse => {
                if (questionsResponse.status === 200) {
                    questionArray = questionsResponse.data;
                }
            })
            .catch(function (error){
                console.log(error);
        })

        axios.get('answerpapers/'+currentQuestionPaperID+'/'+id)
            .then(answerPaperResponse => {
                if (answerPaperResponse.status === 200) {
                    anspaperID = answerPaperResponse.data.id;

                    if (answerPaperResponse.data.status === 'Submitted') {
                        setEvaluated("true");
                    }

                    axios.get('answers/'+anspaperID)
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
                                                "answerPaperID":eachAnswer.answerPaperID,
                                                "id": eachAnswer.id,
                                                "marksObtained": eachAnswer.marksObtained,
                                                "correctIncorrect": eachAnswer.correctIncorrect,
                                                "imagePath": eachAnswer.imagePath
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

    const renderCollapseBody = () => {
        return students && students.map(({ id, fullName, className, section}) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{fullName}</td>
                    <td>{className}</td>
                    <td>{section}</td>
                    <td>
                        <img src={EvaluateIcon} alt='' style={{cursor:'pointer'}} width="30" height="30" data-toggle="modal" data-target="#exampleModalLong" onClick={() => getStudentAndAnswerDetails(id)} title="Click here to evaluate this Answer Sheet." />
                    </td>
                </tr>
            )
        })
    }

    const saveMarks = () => {
        questions.map(function (eachQuestion){
            var answerPayload = {
                "id": eachQuestion.id,
                "correctIncorrect": eachQuestion.correctIncorrect,
                "marksObtained": eachQuestion.marksObtained
            }

            axios.put('answers', answerPayload)
                .then(function (response){
                    if (response.status === 200) {
                        axios.put('answerpapers/'+eachQuestion.answerPaperID)
                            .then(function (response){
                                if (response.status === 200) {
                                    console.log("Success");
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
        })
    }

    const renderQList = () => {
        return questions && questions.map(function (eachQuestion) {
            return (
                <li className="list-group-item text-left" key={eachQuestion.id}>
                    <label className="font-weight-bold">Question</label>
                    <br></br>
                    <label className="font-weight-normal">{eachQuestion.question}</label>
                    <br></br>
                    <label className="font-weight-bold">Total Marks : {eachQuestion.marks}</label>
                </li>
            )
        });

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
                    {eachQuestion.imagePath ? <div>
                        <div className="media">
                            <img class="align-self-start mr-3" onClick={() => setEnlargeImage(!enlargeImage)} 
                                 style={{cursor:'pointer'}} width='90' height='90' src={eachQuestion.imagePath}></img>
                            <div className="media-body">
                                <p className="font-weight-normal">{eachQuestion.answer}</p>
                            </div>
                        </div>
                        <div id={"portal"+eachQuestion.id} style={{display: enlargeImage ? 'block' : 'none' }} className="portal">
                            <img class="align-self-start mr-3" width='700' height='700' src={eachQuestion.imagePath}></img>
                        </div>
                    </div>
                    : <p className="font-weight-normal">{eachQuestion.answer}</p>}
                    <br></br>
                    <form className="form-inline">
                        <label className="font-weight-bold">Evaluation : </label>
                        {evaluated === "true" ? eachQuestion.correctIncorrect
                        : <select name="evaluationTypeDropDown" 
                                id={"evaluation"+eachQuestion.id}
                                className="form-control"
                                onChange={handleChange} >
                            <option value="ps">---Please Select---</option>
                            <option value="Correct">Correct</option>
                            <option value="Incorrect">Incorrect</option>
                          </select>}
                        <label className="font-weight-bold">Marks: </label>
                        <div className="form-group mx-sm-2 mb-2">
                        {evaluated === "true" ? eachQuestion.marksObtained
                        : <input type="text" onChange={handleChange} className="form-control" id={"marksObtained"+eachQuestion.id} placeholder="Marks" />
                        }
                        </div>
                        <label className="font-weight-bold">Total Marks : {eachQuestion.marks}</label>
                    </form>
                </li>
            )
        });
    }

    const handleChange = (e) => {
        const {id , value} = e.target;

        questions.map(function (eachQuestion){
            let selectId = "evaluation"+eachQuestion.id;
            let marksId = "marksObtained"+eachQuestion.id;
            
            if (id === selectId) {
                eachQuestion.correctIncorrect = value;
            }

            if (id === marksId) {
                eachQuestion.marksObtained = value;
            }
        })
    }

    const renderCollapseHeader = () => {
        let headerElement = ['id', 'Name', 'class', 'section', 'action']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    return (
        <>
            <div>
                <div className="card-body text-center">
                    <h4 className="card-title">Questions Paper(s)</h4>
                    <table className="table table-hover">
                        <thead>
                            <tr className="table-primary">{renderHeader()}</tr>
                        </thead>
                        <tbody>
                            {renderBody()}
                        </tbody>
                    </table>
                </div>
                <div className="collapse shadow-lg p-3 mb-5 bg-white rounded" id="studentList">
                    <div className="card text-center">
                    <h5 className="card-title text-left">Following Students completed the exam</h5>
                        <table className="table table-hover">
                            <thead>
                                <tr className="table-secondary">{renderCollapseHeader()}</tr>
                            </thead>
                            <tbody>
                                {renderCollapseBody()}
                            </tbody>
                        </table>
                    </div>
                </div>
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
                            <button type="button" style={{display: evaluated === "true" ? 'none' : 'block'}} className="btn btn-primary" data-dismiss="modal" onClick={() => {saveMarks()}}>Save Changes</button>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="deleteConfirm" tabIndex="-1" role="dialog" aria-labelledby="deleteConfirmTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteConfirmTitle">Confirm Deletion</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to permanently delete this Quesion Paper? 
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-danger" data-dismiss="modal" onClick={() => deleteData()}>Yes</button>
                                <button type="button" className="btn btn-outline-primary" data-dismiss="modal" onClick={() => dontDeleteData()}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="viewEditQuestions" tabIndex="-1" role="dialog" aria-labelledby="viewEditQuestionsTitle" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="viewEditQuestionsTitle">Subject: {questionPaper.subject}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ul className="list-group list-group-flush">
                                    {renderQList()}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withRouter(QuestionTable);