import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";

function QuestionPaperForm(props) {

    const [state , setState] = useState({
        subject : "",
        className : "",
        section: "",
        numberOfQuestions : "",
        fullMarks : "",
        passMarks : "",
        duration : "",
        evaluationType : "manual",
        instructions : "",
        teacherID : "",
        successMessage: "",
        questionPaperID : ""
    })
    
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleResetClick = (e) => {
        e.preventDefault();
        setState({
            subject : "",
            className : "",
            section: "",
            numberOfQuestions : "",
            fullMarks : "",
            passMarks : "",
            duration : "",
            evaluationType : "manual",
            instructions : "",
            teacherID : "",
            successMessage: "",
            questionPaperID : ""
        });
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        sendDetailsToServer();
    }

    const handleAddEditClick = (e) => {
        e.preventDefault();
        console.log(state.questionPaperID);
    }

    const sendDetailsToServer = () => {
        if(state.subject.length && state.className.length) {
            props.showError(null);
            const payload={
                "subject" : state.subject,
                "className" : state.className,
                "section": state.section,
                "numberOfQuestions" : state.numberOfQuestions,
                "fullMarks" : state.fullMarks,
                "passMarks" : state.passMarks,
                "duration" : state.duration,
                "evaluationType" : state.evaluationType,
                "instructions" : state.instructions,
                "teacherID" : props.location.state.id
            }
            axios.post(API_BASE_URL+'questionpaper', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'questionPaperID' : response.data.id,
                            'successMessage' : 'Question paper created/ edited successfully.'
                        }))
                        props.showError(null);
                    } else{
                        props.showError("Some error ocurred");
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
        <div className="card col-12 col-lg-30 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="subjectInput">Subject</label>
                <input type="text" 
                       className="form-control" 
                       id="subject" 
                       placeholder="Enter Subject" 
                       value={state.subject}
                       onChange={handleChange} />
                </div>
                <div className="form-group text-left">
                <label htmlFor="classNameInput">Class</label>
                <input type="text" 
                       className="form-control" 
                       id="className" 
                       placeholder="Enter Class" 
                       value={state.className}
                       onChange={handleChange} />
                </div>
                <div className="form-group text-left">
                <label htmlFor="sectionInput">Section</label>
                <input type="text" 
                       className="form-control" 
                       id="section" 
                       placeholder="Enter Section" 
                       value={state.section}
                       onChange={handleChange} />
                </div>
                <div className="form-group text-left">
                <label htmlFor="numberOfQuestionsInput">Total Questions</label>
                <input type="text" 
                       className="form-control" 
                       id="numberOfQuestions" 
                       placeholder="Enter total number of questions" 
                       value={state.numberOfQuestions}
                       onChange={handleChange} />
                </div>
                <div className="form-group text-left">
                <label htmlFor="fullMarksInput">Full Marks</label>
                <input type="text" 
                       className="form-control" 
                       id="fullMarks" 
                       placeholder="Enter full marks" 
                       value={state.fullMarks}
                       onChange={handleChange} />
                </div>
                <div className="form-group text-left">
                <label htmlFor="passMarksInput">Pass Marks</label>
                <input type="text" 
                       className="form-control" 
                       id="passMarks" 
                       placeholder="Enter passing marks" 
                       value={state.passMarks}
                       onChange={handleChange} />
                </div>
                <div className="form-group text-left">
                <label htmlFor="durationInput">Duration (in minutes)</label>
                <input type="text" 
                       className="form-control" 
                       id="duration" 
                       placeholder="Enter duration in minutes" 
                       value={state.duration}
                       onChange={handleChange} />
                </div>
                <div className="form-group text-left">
                <label htmlFor="evaluationTypeDropDown">Evaluation Type</label>
                <select name="evaluationTypeDropDown" 
                        id="evaluationType"
                        className="form-control"
                        value={state.evaluationType}
                        onChange={handleChange}>
                    <option value="manual">Manual</option>
                    <option value="automated">Automated</option>
                    <option value="mixed">Mixed</option>
                </select>
                </div>
                <div className="form-group text-left">
                <label htmlFor="instructionsInput">Instructions</label>
                <textarea 
                       className="form-control" 
                       id="instructions" 
                       placeholder="Enter instructions to be followed during Examination." 
                       value={state.instructions}
                       onChange={handleChange} />
                </div>
                <div className="form-group form-inline">
                <button
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleResetClick}>
                    Reset
                </button>
                <div style={{paddingLeft: '15%'}} >
                    <button
                        type="submit" 
                        className="btn btn-primary" 
                        onClick={handleSubmitClick}>
                        Save
                    </button>
                </div>
                <div style={{display: state.successMessage ? 'block' : 'none', paddingLeft: '19%'}} >
                    <button
                        type="submit" 
                        className="btn btn-primary" 
                        onClick={handleAddEditClick}>
                        Add/ Edit Question(s)
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

export default withRouter(QuestionPaperForm);