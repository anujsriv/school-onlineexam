import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import { isNullOrUndefined } from 'util';
import TranslateIcon from '../Images/translate.png';
import Dictaphone from '../SpeechRecognition/Dictaphone';
import UserProfile from '../../closure/UserProfile';

function StartExam(props) {

    const [questionPaper, setQuestionPaper] = useState([]);

    const [state, setState] = useState({
        multiChoice: [],
        singleChoice: "",
        answerText: "",
        successMessage: null,
        disabled: "false"
    })

    const [pagable, setPagable] = useState({
        currentPageNumber : "",
        totalNumberOfPages: ""
    });

    const [question, setQuestion] = useState({
        questionPaperID : "",
        type: "",
        question: "",
        marks: "",
        options: "",
        imagePath: ""
    });

    const [answer, setAnswer] = useState({
        answerPaperID : "",
        questionID : "",
        type: "",
        answerString : ""
    });

    const[states, setStates] = useState({
        answerMap: new Map()
    });

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        if (!isNullOrUndefined(props.location.state)) {
            const response = await axios.get(API_BASE_URL+'questionpaper/'+props.location.state.questionPaperID)
            setQuestionPaper(response.data)
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

            axios.post(API_BASE_URL+'translate', payload)
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

    const handleNextClick = (e) => {

        e.preventDefault();
        const {id} = e.target;
        let pageNumber = 0;

        if (id === 'next' || id === 'submit') {
            handleAnswerState();
            pageNumber = pagable.currentPageNumber + 1;
        } else if (id === 'previous') {
            pageNumber = pagable.currentPageNumber - 1;
        }

        if (id === 'start') {
            const payload={
                "questionPaperID":props.location.state.questionPaperID,
                "studentID":props.location.state.studentID,
                "status":"in-progress"
            }
            axios.post(API_BASE_URL+'answerpapers', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setAnswer({
                            'answerPaperID':response.data.id
                        });
                    } else{
                        console.log("Some error occured");
                    }
            })
            .catch(function (error) {
                    console.log(error);
            });

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
        
        if (id === 'submit') {
            let allSuccess = true;
            states.answerMap.forEach(function(eachAnswer, key) {
                const payload = {
                    "answerPaperID": eachAnswer.answerPaperID,
                    "questionID": eachAnswer.questionID,
                    "answer": eachAnswer.answerString
                }

                axios.post(API_BASE_URL+'answers', payload)
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
            
        } else {
            axios.get(API_BASE_URL+'question/'+props.location.state.questionPaperID+'/'+pageNumber)
                .then(res =>{
                    const response = res;
                    setAnswer(prevState=> ({
                        ...prevState,
                        'questionID' : response.data.content[0].id
                    }));

                    if (states.answerMap.has(response.data.content[0].id)) {
                        const eachAnswer = states.answerMap.get(response.data.content[0].id);

                        if (eachAnswer.type === 'multi') {
                            state.multiChoice = eachAnswer.answerString.split(',');
                        }

                        if (eachAnswer.type === 'single') {
                            state.singleChoice = eachAnswer.answerString;
                        }

                        if (eachAnswer.type === 'subjective') {
                            state.answerText = eachAnswer.answerString;
                        }
                    }
                    displayQuestion(response.data);
                });
        }
    }

    const displayQuestion = (data) => {
        setPagable({
            'currentPageNumber': data.pageable.pageNumber,
            'totalNumberOfPages': data.totalPages
        });

        setQuestion({
            'questionPaperID' : data.content[0].questionPaperID,
            'type': data.content[0].type,
            'question': data.content[0].question,
            'marks': data.content[0].marks,
            'options': data.content[0].options,
            'imagePath': data.content[0].imagePath
        });
    }

    const renderOptions = () => {
        
        let localOptions = question.options.split(',');

        return localOptions.map((key, index) => {
            return <option key={index}>{key}</option>
        })
    }

    const handleChange = (e) => {
        const {id , value} = e.target;

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

            if (states.answerMap.has(answer.questionID)) {
                const eachAnswer = states.answerMap.get(answer.questionID);
                eachAnswer.answerString = values.toString();
                states.answerMap.set(answer.questionID, eachAnswer);
            }

        } else {
            setState(prevState => ({
                ...prevState,
                [id] : value
            }))

            if (states.answerMap.has(answer.questionID)) {
                const eachAnswer = states.answerMap.get(answer.questionID);
                eachAnswer.answerString = value;
                states.answerMap.set(answer.questionID, eachAnswer);
            }
        }
    }

    const handleAnswerState = () => {
        if (states.answerMap.has(answer.questionID)) {
            const eachAnswer = states.answerMap.get(answer.questionID);

            if (eachAnswer.type === 'multi') {
                state.multiChoice = eachAnswer.answerString.split(',');
            }

            if (eachAnswer.type === 'single') {
                state.singleChoice = eachAnswer.answerString;
            }

            if (eachAnswer.type === 'subjective') {
                state.answerText = eachAnswer.answerString;
            }

            if (question.type === 'multi') {
                answer.answerString = state.multiChoice.toString();
                answer.type = 'multi';
            }
    
            if (question.type === 'single') {
                answer.answerString = state.singleChoice;
                answer.type = 'single';
            }
    
            if (question.type === 'subjective') {
                answer.answerString = state.answerText
                answer.type = 'subjective';
            }
        } else {
            if (question.type === 'multi') {
                answer.answerString = state.multiChoice.toString();
                answer.type = 'multi';
            }
    
            if (question.type === 'single') {
                answer.answerString = state.singleChoice;
                answer.type = 'single';
            }
    
            if (question.type === 'subjective') {
                answer.answerString = state.answerText
                answer.type = 'subjective';
            }
    
            setAnswer(prevState=> ({
                ...prevState,
                'questionID' : "",
                'answerString': ""
            }));
            setState({
                'multiChoice': [],
                'singleChoice': "",
                'answerText': ""
            });
        }

        states.answerMap.set(answer.questionID, answer);
    }

    return(
            <div className="card w-75 text-left">
                <div className="alert alert-success" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                    {state.successMessage}
                    <p>For security purposes, please close the Browser Window.</p>
                </div>
                { question.type ?
                    <div style={{display: state.disabled === 'disabled' ? 'none' : 'block' }} className="card text-left">
                        <h5 className="card-header">{question.question} ({question.marks})</h5>
                        <div className="card-body">
                            <div style={{display: question.type === 'multi' ? 'block' : 'none' }} className="form-group">
                                <label htmlFor="multi">Choose the correct option(s). There can be more than 1 correct answer. Press 'Ctrl' and click to select multiple options.</label>
                                <select multiple className="form-control" id="multiChoice" value={state.multiChoice} onChange={handleChange} >
                                    {renderOptions()}
                                </select>
                            </div>

                            <div style={{display: question.type === 'single' ? 'block' : 'none' }} className="form-group">
                                <label htmlFor="single">Choose the correct option.</label>
                                <select className="form-control" id="singleChoice" value={state.singleChoice} onChange={handleChange} >
                                    {renderOptions()}
                                </select>
                            </div>

                            <div style={{display: question.type === 'subjective' ? 'block' : 'none' }} className="form-group">
                                    {questionPaper.language !== 'en' ?
                                        <div>
                                        <p>Instructions: Please note to write your 'answer' in any langauge other than 'English', 
                                        <br></br>please type in English (or the text copied from speech converter) and click 
                                        <br></br>the button below to convert it into selected language.</p>
                                        <img src={TranslateIcon} alt='' width="30" height="30" onClick={() => translate('answerText')} title="Click here to translate the above text." />
                                        </div>
                                        : <p></p>
                                    }
                                    <textarea className="form-control" rows="5" id="answerText" value={state.answerText} onChange={handleChange} placeholder="Type your answer here."/>
                                    <Dictaphone />
                            </div>
                            <div className="form-group form-inline">
                                <div style={{display: pagable.currentPageNumber !== 0 ? 'block' : 'none', paddingRight: '15%' }}>
                                    <button id='previous' type="submit" className="btn btn-primary" onClick={handleNextClick} >Previous</button>
                                </div>
                                <button id='next' style={{display: pagable.currentPageNumber !== pagable.totalNumberOfPages -1 ? 'block' : 'none'}} type="submit" className="btn btn-primary" onClick={handleNextClick} >Next</button>
                                <button id='submit' style={{display: pagable.currentPageNumber === pagable.totalNumberOfPages -1 ? 'block' : 'none'}} type="submit" className="btn btn-primary" onClick={handleNextClick} >Submit</button>
                            </div>
                        </div>
                    </div> : 
                    <div style={{display: question.type ? 'none' : 'block' }} className="card text-left">
                        <h5 className="card-header ">General Instructions</h5>
                        <div className="card-body">
                            <p className="card-text">{questionPaper.instructions} Please click on 'Start' to start your exam.</p>
                            <button id='start' type="submit" className="btn btn-primary" onClick={handleNextClick} >Start</button>
                        </div>
                    </div> 
                }
            </div>
    )
}

export default withRouter(StartExam);