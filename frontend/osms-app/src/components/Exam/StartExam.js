import React, { useState, useEffect } from 'react';
import axios from '../CustomAxios/Axios';
import { withRouter } from "react-router-dom";
import { isNullOrUndefined } from 'util';
import TranslateIcon from '../Images/translate.png';
import Dictaphone from '../SpeechRecognition/Dictaphone';
import UserProfile from '../../closure/UserProfile';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

function StartExam(props) {

    const [uploadFiles, setUploadFiles] = useState([])

    const [questionPaper, setQuestionPaper] = useState([]);

    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState([]);

    const [answerPaperID, setAnswerPaperID] = useState(null);

    const [showSubmit, setShowSubmit] = useState(false);
    
    const [attemptedQNum, setAttemptedQNum] = useState(1);

    const [show, setShow] = useState(false);

    const [state, setState] = useState({
        multiChoice: [],
        singleChoice: "ps-sc",
        answerText: "",
        successMessage: null,
        uploadSuccessMessage: null,
        disabled: "false"
    })

    const [question, setQuestion] = useState({
        type: "",
        question: "",
        marks: "",
        options: "",
        imagePath: "",
        id: "",
        buttonClass: "btn btn-outline-danger"
    });

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        if (!isNullOrUndefined(props.location.state)) {
            const response = await axios.get('questionpaper/'+props.location.state.questionPaperID)
            setQuestionPaper(response.data);
        }
    }

    const translate = (fieldName) => {
        if (fieldName === 'answerText') {
            const payload = {
                "q" : state.answerText,
                "source" : "en",
                "target" : questionPaper.language,
                "format" : "text"
            }

            axios.post('translate', payload)
            .then(function (response) {
                if (response.status === 200) {
                    setState(prevState => ({
                        ...prevState,
                        answerText : response.data
                    }))
                }
            })
            .catch(function (error){
                console.log(error);
            })
        }
    }

    const handleStartClick = (e) => {
        e.preventDefault();
        const payload={
            "questionPaperID":props.location.state.questionPaperID,
            "studentID":props.location.state.studentID,
            "status":"in-progress"
        }
        axios.post('answerpapers', payload)
            .then(function (response) {
                if(response.status === 200){
                    setAnswerPaperID(response.data.id);
                } else{
                    console.log("Some error occured");
                }
        })
        .catch(function (error) {
                console.log(error);
        });

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

        axios.get('question/'+props.location.state.questionPaperID)
            .then(res =>{
                if (res.status === 200) {
                    setQuestions(res.data);
                    setQuestion(res.data[0]);
                }
            })
            .catch(function (error){
                console.log(error);
            });
    }

    const handleQButtonClick = (id) => {
        setState({
            'multiChoice': [],
            'singleChoice': "",
            'answerText': ""
        });
        questions.forEach(function (eachQuestion) {
            if (eachQuestion.id === id) {
                setQuestion(eachQuestion);

                answers.forEach(function (eachAnswer){
                    if (eachAnswer.questionID === id) {
                        if (eachAnswer.answer) {
                            if (eachQuestion.type === 'multi') {
                                setState(prevState => ({
                                    ...prevState,
                                    "multiChoice": eachAnswer.answer.split(',')
                                }))
                            }
            
                            if (eachQuestion.type === 'single') {
                                setState(prevState => ({
                                    ...prevState,
                                    "singleChoice": eachAnswer.answer
                                }))
                            }
            
                            if (eachQuestion.type === 'subjective') {
                                setState(prevState => ({
                                    ...prevState,
                                    "answerText": eachAnswer.answer
                                }))
                            }
                        }
                    }
                });
            }
        });
    }

    const handleSaveClick = (e) => {
        e.preventDefault();

        if (question.type === 'multi') {
            state.answerText = state.multiChoice.toString();
        }

        if (question.type === 'single') {
            state.answerText = state.singleChoice;
        }

        let value = state.answerText;
        let apId = answerPaperID;
        let qId = question.id;

        let found = false;
        answers.forEach(function (eachAnswer){
            if (eachAnswer.questionID === qId) {
                eachAnswer.answer = value;
                found = true;
            }
        });

        if (!found) {
            const answer = {
                "answerPaperID":apId,
                "questionID":qId,
                "answer":value
            }

            answers.push(answer);
        }

        if (value) {
            question.buttonClass="btn btn-outline-success";
            setAttemptedQNum(attemptedQNum + 1);
        }

        if (attemptedQNum >= questionPaper.numberOfQuestions) {
            setShowSubmit(true);
        }

        handleQButtonClick(question.id);
    }

    const handleSubmitClick = () => {
        
        let allSuccess = true;
        answers.forEach(function(eachAnswer) {
            const payload = {
                "answerPaperID": eachAnswer.answerPaperID,
                "questionID": eachAnswer.questionID,
                "answer": eachAnswer.answer,
                "imagePath": eachAnswer.imagePath
            }

            axios.post('answers', payload)
                .then(function (response) {
                    if(response.status === 200){
                        
                    } else{
                        allSuccess = false;
                        console.log("Some error occured");
                    }
                })
                .catch(function (error) {
                        console.log(error);
                });
        });

        if (allSuccess) {
            setState(prevState => ({
                ...prevState,
                'successMessage' : 'Answers submitted Successfully !!!',
                'disabled' : 'disabled'
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                'successMessage' : 'Some problem occured. Please try again.',
                'disabled' : 'disabled'
            }))
        }
    }

    const renderOptions = () => {
        
        let localOptions = question.options.split(',');

        return localOptions.map((key, index) => {
            return <option key={index}>{key}</option>
        })
    }

    const handleUploadFile = (e) => {
        e.preventDefault();
        Array.from(uploadFiles).forEach(function (eachFile){
            let config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            let formData = new FormData();
            formData.append("file", eachFile);
            formData.append("docType", "answer");
            formData.append("userName", UserProfile.getUserName());
            formData.append("fileName", question.id);

            axios.post('upload', formData, config)
                .then(function (response){
                    if (response.status === 200) {
                        let found = false;
                        answers.forEach(function (eachAnswer){
                            if (eachAnswer.questionID === question.id) {
                                eachAnswer.imagePath = response.data;
                                found = true;
                            }
                        });

                        if (!found) {
                            let apId = answerPaperID;
                            const answer = {
                                "answerPaperID":apId,
                                "questionID":question.id,
                                "imagePath":response.data
                            }
                            answers.push(answer);
                        }

                        question.buttonClass="btn btn-outline-success";
                        setAttemptedQNum(attemptedQNum + 1);

                        if (attemptedQNum >= questionPaper.numberOfQuestions) {
                            setShowSubmit(true);
                        }

                        setState(prevState => ({
                            ...prevState,
                            'uploadSuccessMessage' : 'Answer uploaded/ Diagram attached successfully.'
                        }))
                    } else {
                        props.showError('Some error occured while uploading question.');        
                    }
                })
            .catch(function (error){
                console.log(error);
                props.showError('The field file exceeds its maximum permitted size of 1 Mb');
            })
        })
    }

    const handleChange = (e) => {
        const {id , value} = e.target;

        if (id === 'uploadAnswer') {
            setUploadFiles(e.target.files);
        }
        
        if (id === 'multiChoice') {
            var options = e.target.options;
            var values = [];
            for (var i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    values.push(options[i].value);
                }
            }

            setState(prevState => ({
                ...prevState,
                [id] : values
            }))

        } else {
            setState(prevState => ({
                ...prevState,
                [id] : value
            }))
        }
    }

    const handleClose = () => {
        setShow(false);
        handleSubmitClick();
    }
    const handleShow = () => setShow(true);

    const handleTimeComplete = () => {
        handleShow();
    }

    const renderHeader = () => {
        let headerElement = ['#', 'status']

        return headerElement.map((key, index) => {
            return <th scope="col" key={index}>{key.toUpperCase()}</th>
        })
    }

    const children = ({ remainingTime }) => {
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60

        return `${hours}:${minutes}:${seconds}`
    }

    const renderBody = () => {
        let i = 1;
        return questions && questions.map(function (eachQuestion) {
            return (
                <tr key={eachQuestion.id} id={eachQuestion.id}>
                    <th scope="row">{i}</th>
                    <td>
                        <button key={eachQuestion.id} id={eachQuestion.id} type="button" onClick={() => handleQButtonClick(eachQuestion.id)} className={eachQuestion.buttonClass}>Question {i++}</button>
                    </td>
                </tr>
            )
        });
    }

    return(
        <div className="container-fluid d-flex justify-content-center align-items-center flex-column">
            <div className="card w-75 text-left">
                <div className="alert alert-success" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                    {state.successMessage}
                    <p>For security purposes, please 'Logout' and close the Browser Window.</p>
                </div>
                { question.type ?
                    <div className="d-flex bd-highlight mb-3">
                        <div style={{display: state.disabled === 'disabled' ? 'none' : 'block'}} className="p-2 bd-highlight text-center">
                            <table className="table">
                                <thead>
                                    <tr className="table-primary">{renderHeader()}</tr>
                                </thead>
                                <tbody>
                                    {renderBody()}
                                </tbody>
                            </table>
                        </div> 
                        <div style={{display: state.disabled === 'disabled' ? 'none' : 'block', width:'100%'}} className="card mr-auto p-2 bd-highlight">
                            <h5 className="card-header">{question.question} ({question.marks})</h5>
                            <div className="card-body" >
                                <div style={{display: question.type === 'multi' ? 'block' : 'none' }} className="form-group">
                                    <label htmlFor="multi">Choose the correct option(s). There can be more than 1 correct answer. Press 'Ctrl' and click to select multiple options.</label>
                                    <select multiple className="form-control" id="multiChoice" value={state.multiChoice} onChange={handleChange} >
                                        <option value="ps-mc">---Please Select---</option>
                                        {renderOptions()}
                                    </select>
                                </div>

                                <div style={{display: question.type === 'single' ? 'block' : 'none' }} className="form-group">
                                    <label htmlFor="single">Choose the correct option.</label>
                                    <select className="form-control" id="singleChoice" value={state.singleChoice} onChange={handleChange} >
                                        <option value="ps-sc">---Please Select---</option>
                                        {renderOptions()}
                                    </select>
                                </div>

                                <div style={{display: question.type === 'subjective' ? 'block' : 'none' }} className="form-group">
                                        {questionPaper.language !== 'en' ?
                                            <div>
                                            <small>Instructions: Please note to write your 'answer' in any langauge other than 'English', 
                                            please type in English (or the text copied from speech converter) and click 
                                            the button <img src={TranslateIcon} alt='' width="30" height="30" /> to convert it into selected language.</small>
                                            <br /><br />
                                            <img src={TranslateIcon} style={{cursor: "pointer"}} alt='' width="30" height="30" onClick={() => translate('answerText')} title="Click here to translate the above text." />
                                            </div>
                                            : <p></p>
                                        }
                                        <textarea className="form-control" rows="5" id="answerText" value={state.answerText} onChange={handleChange} placeholder="Type your answer here."/>
                                        <h4 />
                                        <Dictaphone />
                                </div>
                                <div className="form-group form-inline">
                                    <button id='save'  type="button" className="btn btn-primary form-group" onClick={handleSaveClick} >Save</button>
                                    <div style={{display: question.type === 'subjective' ? 'block' : 'none', paddingLeft: '2%' }} className="form-group">
                                        <small>Add a diagram to your answer And/or Upload your answer.</small>
                                        <input type="file" accept="image/*" key={question.id} onChange={handleChange} className="form-control-file" id="uploadAnswer"/>
                                    </div>
                                    <div style={{display: question.type === 'subjective' ? 'block' : 'none'}} className="form-group">
                                        <button type="button" className="btn btn-primary" onClick={handleUploadFile}>Upload</button>
                                    </div>
                                    <button id='submit' style={{display: showSubmit ? 'block' : 'none'}} type="button" className="btn btn-primary form-group" data-toggle="modal" data-target="#submitConfirm">Submit</button>
                                </div>
                                <div className="modal fade" id="submitConfirm" tabIndex="-1" role="dialog" aria-labelledby="submitConfirmTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="submitConfirmTitle">Confirm Submit</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                Are you sure you want to submit your Answer Paper? 
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-outline-success" data-dismiss="modal" onClick={() => handleSubmitClick()}>Yes</button>
                                                <button type="button" className="btn btn-outline-primary" data-dismiss="modal" >No</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Modal show={show} backdrop="static" onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                            Time's Up !!
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p>
                                            Sorry time's up !!
                                            <br />All answered questions will be auto-submitted.
                                        </p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>OK</Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </div>
                        <div style={{display: state.disabled === 'disabled' ? 'none' : 'block'}} className="p-2 bd-highlight" >
                            <CountdownCircleTimer
                                isPlaying
                                duration={questionPaper.duration*60}
                                colors={[
                                ['#004777', 0.33], 
                                ['#F7B801', 0.33],
                                ['#A30000', 0.33],
                                ]}
                                onComplete={handleTimeComplete}
                                size='90'
                                >
                                {children}
                            </CountdownCircleTimer> 
                        </div>
                    </div>
                    : 
                    <div style={{display: question.type ? 'none' : 'block' }} className="card text-left">
                        <h5 className="card-header ">General Instructions</h5>
                        <div className="card-body">
                            <p className="card-text">{questionPaper.instructions} 
                            <br />Click on each 'Question #' to attempt the question.
                            <br />Click on 'Save' after writing/ uploading your answer/ supported diagram for each question.
                            <br />To edit/ modify any answer, please click on the 'Question #' in left hand panel.
                            <br />Click on 'Submit' at the end to submit your answers. Please note this cannot be undone.
                            <br />Click on 'Start' to start your exam.</p>
                            <button id='start' type="button" className="btn btn-primary" onClick={handleStartClick} >Start</button>
                        </div>
                    </div> 
                }
                <div className="alert alert-success" style={{display: state.uploadSuccessMessage ? 'block' : 'none' }} role="alert">
                    {state.uploadSuccessMessage}
                </div>
            </div>
        </div>
    )
}

export default withRouter(StartExam);