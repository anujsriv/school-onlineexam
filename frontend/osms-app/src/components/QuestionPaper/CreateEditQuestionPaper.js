import React, {useState} from 'react';
import axios from '../CustomAxios/Axios';
import { withRouter } from "react-router-dom";
import TranslateIcon from '../Images/translate.png';
import Dictaphone from '../SpeechRecognition/Dictaphone';

function QuestionPaperForm(props) {

    const [showMultiBlock, setShowMultiBlock] = useState(false)

    const [showQuestions, setShowQuestions] = useState(false)

    const [state , setState] = useState({
        subject : "",
        className : "",
        section: "",
        numberOfQuestions : "",
        fullMarks : "",
        passMarks : "",
        duration : "",
        language : "en",
        evaluationType : "manual",
        instructions : "",
        teacherID : "",
        successMessage: "",
        questionPaper : ""
    })

    const [questionState , setQuestionState] = useState({
        questionType : "subjective",
        question : "",
        marks : "",
        options : "",
        answers : "",
        questionPaperID : state.questionPaper.id,
        totalQuestions : state.questionPaper.numberOfQuestions,
        currentQuestion : 1,
        successMessage: ""
    })

    const translate = (fieldName) => {
        if (fieldName === 'question') {
            const payload = {
                "q" : questionState.question,
                "source" : "en",
                "target" : state.questionPaper.language,
                "format" : "text"
            }

            axios.post('translate', payload)
            .then(function (response) {
                if (response.status === 200) {
                    setQuestionState(prevState => ({
                        ...prevState,
                        question : response.data + " "
                    }))
                }
            })
            .catch(function (error){
                console.log(error);
            })
        }
        if (fieldName === 'options') {
            const payload = {
                "q" : questionState.options,
                "source" : "en",
                "target" : state.questionPaper.language,
                "format" : "text"
            }

            axios.post('translate', payload)
            .then(function (response) {
                if (response.status === 200) {
                    setQuestionState(prevState => ({
                        ...prevState,
                        options : response.data
                    }))
                }
            })
            .catch(function (error){
                console.log(error);
            })
        }
    }
    
    const handleChange = (e) => {
        const {id , value} = e.target;   
        
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

        setQuestionState(prevState => ({
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
            language : "en",
            evaluationType : "manual",
            instructions : "",
            teacherID : "",
            successMessage: "",
            questionPaper : ""
        });
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        sendDetailsToServer();
    }

    const handleAddEditClick = (e) => {
        e.preventDefault();
        setShowQuestions(true);
        setQuestionState({
            questionType : "subjective",
            question : "",
            marks : "",
            options : "",
            answers : "",
            questionPaperID : state.questionPaper.id,
            totalQuestions : state.questionPaper.numberOfQuestions,
            currentQuestion : 1,
            successMessage: ""
        });
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
                "language" : state.language,
                "evaluationType" : state.evaluationType,
                "instructions" : state.instructions,
                "teacherID" : props.location.state.id
            }
            axios.post('questionpaper', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'questionPaper' : response.data,
                            'successMessage' : 'Question paper created/ edited successfully.'
                        }))
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

    const handleQuestionResetClick = (e) => {
        e.preventDefault();
        setQuestionState({
            questionType : "subjective",
            question : "",
            marks : "",
            options : "",
            answers : "",
            questionPaperID : state.questionPaper.id,
            totalQuestions : state.questionPaper.numberOfQuestions,
            currentQuestion : 1,
            successMessage: ""
        });
        setShowMultiBlock(false);
    }

    const handleQuestionSubmitClick = (e) => {
        e.preventDefault();
        sendQuestionDetailsToServer();
    }

    const sendQuestionDetailsToServer = () => {
        if(questionState.question.length && questionState.questionType.length) {
            props.showError(null);
            const payload={
                "type" : questionState.questionType,
                "question" : questionState.question,
                "marks" : questionState.marks,
                "options": questionState.options,
                "rightAnswers" : questionState.answers,
                "questionPaperID" : state.questionPaper.id
            }
            axios.post('question', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setQuestionState({
                            questionType : "subjective",
                            question : "",
                            marks : "",
                            options : "",
                            answers : "",
                            questionPaperID : state.questionPaper.id,
                            totalQuestions : state.questionPaper.numberOfQuestions,
                            currentQuestion : questionState.currentQuestion + 1,
                            successMessage : 'Question added/ edited successfully.'
                        })

                        if (questionState.currentQuestion === questionState.totalQuestions) {
                           
                            setShowQuestions(false);
                        }

                        setShowMultiBlock(false);
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
        <div>
            <div style={{display: showQuestions ? 'block' : 'none' }} >
                <div className="card col-12 col-lg-30 hv-center">Question - {questionState.currentQuestion} Of {questionState.totalQuestions}
                    <form>
                        {state.questionPaper.language !== 'en' ?
                                <div className="form-group text-left">
                                <p>Instructions: 
                                <br></br>Please note to write your 'question' and 'options' (in case of multiple choice) in any langauge other than 'English', 
                                <br></br>please type in English and click the button <img src={TranslateIcon} alt='' width="30" height="30" /> to convert it into selected language.</p>
                                </div>
                                : <p></p>
                        }
                        <div className="form-group text-left">
                            <label htmlFor="questionTypeDropDown">Question Type</label>
                            <select name="questionTypeDropDown" 
                                    id="questionType"
                                    className="form-control"
                                    value={questionState.questionType}
                                    onChange={handleChange}>
                                <option value="subjective">Subjective</option>
                                <option value="multi">Multiple Choice - Multiple Answer</option>
                                <option value="single">Multiple Choice - Single Answer</option>
                            </select>
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="questionInput">Question</label>
                            {state.questionPaper.language !== 'en' ?
                                <img src={TranslateIcon} style={{cursor: "pointer"}} className="form-group text-right" alt='Click Here to translate' width="30" height="30" onClick={() => translate('question')} title="Click here to translate the below text." />
                                : <p></p>
                                }
                            <textarea 
                                className="form-control" 
                                id="question" 
                                placeholder="Enter the question." 
                                value={questionState.question}
                                onChange={handleChange} />
                            <Dictaphone />
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="marksInput">Marks</label>
                            <input type="text" 
                                className="form-control" 
                                id="marks" 
                                placeholder="Enter the total marks for this question." 
                                value={questionState.marks}
                                onChange={handleChange} />
                        </div>
                        <div style={{display: showMultiBlock ? 'block' : 'none' }} >
                            <div className="form-group text-left">
                                <label htmlFor="optionsInput">Options</label>
                                {state.questionPaper.language !== 'en' ?
                                    <img src={TranslateIcon} style={{cursor: "pointer"}} className="form-group text-right" alt='Click Here to translate' width="30" height="30" onClick={() => translate('options')} title="Click here to translate the below text." />
                                    : <p></p>
                                }
                                <textarea 
                                    className="form-control" 
                                    id="options" 
                                    placeholder="Enter the options. Each option should be separated by a ','" 
                                    value={questionState.options}
                                    onChange={handleChange} />
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="answersInput">Answer(s) for Multiple choice questions.</label>
                                <textarea 
                                    className="form-control" 
                                    id="answers" 
                                    placeholder="Enter the option number of each answer. In case of multiple answers separate by a ','" 
                                    value={questionState.answers}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group form-inline">
                                <button
                                    type="submit" 
                                    className="btn btn-primary"
                                    onClick={handleQuestionResetClick}>
                                    Reset
                                </button>
                            <div style={{paddingLeft: '71%'}} >
                                <button
                                    type="submit" 
                                    className="btn btn-primary" 
                                    onClick={handleQuestionSubmitClick}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="alert alert-success mt-2" style={{display: questionState.successMessage ? 'block' : 'none' }} role="alert">
                        {questionState.successMessage}
                    </div>
                </div>
            </div>
            <div style={{display: !showQuestions ? 'block' : 'none' }} >
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
                            <label htmlFor="languageDropDown">Language</label>
                            <select name="languageDropDown" 
                                    id="language"
                                    className="form-control"
                                    value={state.language}
                                    onChange={handleChange}>
                                <option value="bn">Bengali</option>
                                <option value="en">English (Default)</option>
                                <option value="gu">Gujrati</option>
                                <option value="hi">Hindi</option>
                                <option value="kn">Kannada</option>
                                <option value="ml">Malayalam</option>
                                <option value="mr">Marathi</option>
                                <option value="or">Odia (Oriya)</option>
                                <option value="pa">Punjabi</option>
                                <option value="ta">Tamil</option>
                                <option value="te">Telegu</option>
                                <option value="ur">Urdu</option>
                            </select>
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
                        <div style={{display: state.successMessage ? 'block' : 'none', paddingLeft: '15%'}} >
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
            </div>
        </div>
    )
}

export default withRouter(QuestionPaperForm);