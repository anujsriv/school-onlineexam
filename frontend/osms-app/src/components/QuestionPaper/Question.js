import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";

function QuestionForm(props) {

    const [showMultiBlock, setShowMultiBlock] = useState(false)

    const [state , setState] = useState({
        questionType : "subjective",
        question : "",
        options : "",
        answers : "",
        successMessage: ""
    })
    
    const handleChange = (e) => {
        const {id , value} = e.target
        if (id === 'questionType') {
            if (value === 'subjective') {
                setShowMultiBlock(false);
            } else {
                setShowMultiBlock(true);
            }
        } 

        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleResetClick = (e) => {
        e.preventDefault();
        setState({
            questionType : "subjective",
            question : "",
            options : "",
            answers : "",
            questionPaperID : props.location.questionPaper.id,
            totalQuestions : props.location.questionPaper.numberOfQuestions,
            currentQuestion : 1,
            successMessage: ""
        });
        setShowMultiBlock(false);
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        console.log(props);
        sendDetailsToServer();
    }

    const sendDetailsToServer = () => {
        if(state.question.length && state.questionType.length) {
            props.showError(null);
            const payload={
                "type" : state.questionType,
                "question" : state.question,
                "options": state.options,
                "rightAnswers" : state.answers,
                "questionPaperID" : props.location.questionPaper.id
            }
            axios.post(API_BASE_URL+'question', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState({
                            questionType : "subjective",
                            question : "",
                            options : "",
                            answers : "",
                            successMessage : 'Question added/ edited successfully.'
                        })
                        state.currentQuestion = state.currentQuestion + 1;
                        props.showError(null);
                    } else{
                        props.showError("Some error ocurred : "+response.message);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    props.showError("Some error ocurred");
                });    
        } else {
            props.showError('Please enter all the fields marked with *.')    
        }
        
    }

    return(
        <div className="card col-12 col-lg-30 hv-center">Question - {state.currentQuestion} Of {state.totalQuestions}
            <form>
                <div className="form-group text-left">
                    <label htmlFor="questionTypeDropDown">Question Type</label>
                    <select name="questionTypeDropDown" 
                            id="questionType"
                            className="form-control"
                            value={state.questionType}
                            onChange={handleChange}>
                        <option value="subjective">Subjective</option>
                        <option value="multi">Multiple Choice - Multiple Answer</option>
                        <option value="single">Multiple Choice - Single Answer</option>
                    </select>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="questionInput">Question</label>
                    <textarea 
                        className="form-control" 
                        id="question" 
                        placeholder="Enter the question." 
                        value={state.question}
                        onChange={handleChange} />
                </div>
                <div style={{display: showMultiBlock ? 'block' : 'none' }} >
                    <div className="form-group text-left">
                        <label htmlFor="optionsInput">Options</label>
                        <textarea 
                            className="form-control" 
                            id="options" 
                            placeholder="Enter the options. Each option should be separated by a ," 
                            value={state.options}
                            onChange={handleChange} />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="answersInput">Answer(s) for Multiple choice questions.</label>
                        <input type="text" 
                            className="form-control" 
                            id="answers" 
                            placeholder="Enter the option number of each answer. In case of multiple answers separate by a ," 
                            value={state.answers}
                            onChange={handleChange} />
                    </div>
                </div>
                <div className="form-group form-inline">
                        <button
                            type="submit" 
                            className="btn btn-primary"
                            onClick={handleResetClick}>
                            Reset
                        </button>
                    <div style={{paddingLeft: '71%'}} >
                        <button
                            type="submit" 
                            className="btn btn-primary" 
                            onClick={handleSubmitClick}>
                            Save
                        </button>
                    </div>
                </div>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
        </div>
    )
}

export default withRouter(QuestionForm);