import React, {useState} from 'react';
import axios from '../CustomAxios/Axios';
import { withRouter } from "react-router-dom";
import TranslateIcon from '../Images/translate.png';
import Dictaphone from '../SpeechRecognition/Dictaphone';
import UserProfile from '../../closure/UserProfile';

function CreateEditQuestionPaper(props) {

    const [subjectColor, setSubjectColor] = useState()
    const [numberOfQuestionsColor, seNnumberOfQuestionscolor] = useState()
    const [fullMarksColor, setFullMarksColor] = useState()
    const [passMarksColor, setPassMarksColor] = useState()
    const [durationColor, setDurationColor] = useState()
    const [questionColor, setQuestionColor] = useState()
    const [marksColor, setMarksColor] = useState()

    const [showMultiBlock, setShowMultiBlock] = useState(false)

    const [showQuestions, setShowQuestions] = useState(false)

    const [showQuestionUpload, setShowQuestionUpload] = useState(false)

    const [uploadFiles, setUploadFiles] = useState([])

    const [uploadFile, setUploadFile] = useState()

    const [preSignUrl, setPreSignUrl] = useState({})

    const [state , setState] = useState({
        subject : "",
        className : "LKG",
        section: "A",
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

        if (id === 'uploadQuestion') {
            setUploadFiles(e.target.files);
        }
        
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

        switch(id) {
            case 'subject':
                setSubjectColor();
                break;
            case  'numberOfQuestions' :
                seNnumberOfQuestionscolor()
                break;
            case  'fullMarks' :
                setFullMarksColor()
                break;
            case  'passMarks' :
                setPassMarksColor()
                break;
            case  'duration' :
                setDurationColor()
                break;
            case 'question':
                setQuestionColor();
                break;
            case 'marks':
                setMarksColor();
                break;
        }
    }

    const handleResetClick = (e) => {
        e.preventDefault();
        setState({
            subject : "",
            className : "LKG",
            section: "A",
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
        setSubjectColor();
        seNnumberOfQuestionscolor();
        setFullMarksColor();
        setPassMarksColor();
        setDurationColor();
        setShowQuestionUpload(false);
    }

    const handleSubmitClick = (e) => {
        let oneFailure = false;
        e.preventDefault();
        Array.prototype.forEach.call(e.target.elements, (element) => {
            if (element.checkValidity() === false) {
                oneFailure = true;
                switch(element.id) {
                    case 'subject':
                        setSubjectColor("red");
                        break;
                    case  'numberOfQuestions' :
                        seNnumberOfQuestionscolor("red")
                        break;
                    case  'fullMarks' :
                        setFullMarksColor("red")
                        break;
                    case  'passMarks' :
                        setPassMarksColor("red")
                        break;
                    case  'duration' :
                        setDurationColor("red")   
                }
            }
        })
        
        if (oneFailure) {
            e.stopPropagation();
            props.showError('Field(s) highlighted in red are mandatory.');
        } else {
            sendDetailsToServer();
        }
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

    const handleUploadClick = (e) => {
        e.preventDefault();
        setShowQuestionUpload(true);
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
            formData.append("docType", "question");
            formData.append("userName", UserProfile.getUserName());
            formData.append("fileName", state.questionPaper.id);

            axios.post('upload', formData, config)
                .then(function (response){
                    if (response.status === 200) {
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Question uploaded successfully.'
                        }))
                    } else {
                        props.showError('Some error occured while uploading question.');        
                    }
                })
            .catch(function (error){
                props.showError('Some error occured while uploading question.');
                console.log(error);
            })
        })
    }

    const sendDetailsToServer = () => {
        //if(state.subject.length && state.className.length) {
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
        //} else {
            //props.showError('Please enter all the fields marked with *.')    
        //}
        
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
        setQuestionColor();
        setMarksColor();
    }

    const handleQuestionSubmitClick = (e) => {
        let oneFailure = false;
        e.preventDefault();
        Array.prototype.forEach.call(e.target.elements, (element) => {
            if (element.checkValidity() === false) {
                oneFailure = true;
                switch(element.id) {
                    case 'question':
                        setQuestionColor("red");
                        break;
                    case 'marks':
                        setMarksColor("red");
                        break;
                }
            }
        })
        
        if (oneFailure) {
            e.stopPropagation();
            props.showError('Field(s) highlighted in red are mandatory.')
        } else {
            sendQuestionDetailsToServer(e);
        }
    }

    const sendQuestionDetailsToServer = (e) => {
        //if(questionState.question.length && questionState.questionType.length) {
            e.preventDefault();
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
                            handleResetClick(e);   
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
        //} else {
            //props.showError('Please enter all the fields marked with *.')    
        //}
        
    }

    return(
        <div className="card-body" >
            <h4 className="card-title">Create a New Question Paper</h4>
            { showQuestions ? 
                <div className="card col-12 col-lg-30 hv-center">Question - {questionState.currentQuestion} Of {questionState.totalQuestions}
                    <form noValidate onSubmit={handleQuestionSubmitClick}>
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
                                style={{borderColor:questionColor}}
                                className="form-control" 
                                id="question" 
                                placeholder="Enter the question." 
                                value={questionState.question}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="marksInput">Marks</label>
                            <input type="text" 
                                style={{borderColor:marksColor}}
                                className="form-control" 
                                id="marks" 
                                placeholder="Enter the total marks for this question." 
                                value={questionState.marks}
                                onChange={handleChange}
                                required />
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
                                    className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                    <Dictaphone />
                    <div className="alert alert-success mt-2" style={{display: questionState.successMessage ? 'block' : 'none' }} role="alert">
                        {questionState.successMessage}
                    </div>
                </div>
                : <div>
                <form noValidate onSubmit={handleSubmitClick}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="subjectInput">Subject</label>
                            <input type="text" 
                                style={{borderColor:subjectColor}}
                                className="form-control" 
                                id="subject" 
                                placeholder="Enter Subject" 
                                value={state.subject}
                                onChange={handleChange} 
                                required />
                        </div>
                        <div className="form-group col-md-6">
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
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="classNameInput">Class</label>
                            <select name="languageDropDown" 
                                    id="className"
                                    className="form-control"
                                    value={state.className}
                                    onChange={handleChange}>
                                <option value="LKG">LKG</option>
                                <option value="UKG">UKG</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                                <option value="V">V</option>
                                <option value="VI">VI</option>
                                <option value="VII">VII</option>
                                <option value="VIII">VIII</option>
                                <option value="IX">IX</option>
                                <option value="X">X</option>
                                <option value="XI">XI</option>
                                <option value="XII">XII</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="sectionInput">Section</label>
                            <select name="languageDropDown" 
                                    id="section"
                                    className="form-control"
                                    value={state.section}
                                    onChange={handleChange}>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                                <option value="F">F</option>
                                <option value="G">G</option>
                                <option value="H">H</option>
                                <option value="I">I</option>
                                <option value="J">J</option>
                                <option value="K">K</option>
                                <option value="L">L</option>
                                <option value="M">M</option>
                                <option value="N">N</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="numberOfQuestionsInput">Total Questions</label>
                            <input type="text" 
                                style={{borderColor:numberOfQuestionsColor}}
                                className="form-control" 
                                id="numberOfQuestions" 
                                placeholder="Enter total number of questions" 
                                value={state.numberOfQuestions}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="form-group col-md-6">
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
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="fullMarksInput">Full Marks</label>
                            <input type="text" 
                                style={{borderColor:fullMarksColor}}
                                className="form-control" 
                                id="fullMarks" 
                                placeholder="Enter full marks" 
                                value={state.fullMarks}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="passMarksInput">Pass Marks</label>
                            <input type="text" 
                                style={{borderColor:passMarksColor}}
                                className="form-control" 
                                id="passMarks" 
                                placeholder="Enter passing marks" 
                                value={state.passMarks}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="durationInput">Duration (in minutes)</label>
                            <input type="text" 
                                style={{borderColor:durationColor}}
                                className="form-control" 
                                id="duration" 
                                placeholder="Enter duration in minutes" 
                                value={state.duration}
                                onChange={handleChange}
                                required />
                        </div>
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
                                className="btn btn-primary" >
                                Save
                            </button>
                        </div>
                        <div style={{display: state.successMessage ? 'block' : 'none', paddingLeft: '15%'}} >
                            <div className="dropdown">
                                <button
                                    type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" 
                                    className="btn btn-primary dropdown-toggle">
                                    Add Question(s)
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" onClick={handleAddEditClick} href="#">Via Form</a>
                                    <a className="dropdown-item" onClick={handleUploadClick} href="#">Upload</a>
                                </div>
                            </div>
                        </div>
                        <div style={{display: showQuestionUpload ? 'block' : 'none', paddingLeft: '10%'}} className="form-group">
                            <input type="file" accept="image/*" value={uploadFile} onChange={handleChange} className="form-control-file" id="uploadQuestion" />
                        </div>
                        <div style={{display: showQuestionUpload ? 'block' : 'none'}} className="form-group">
                            <button
                                type="button" 
                                className="btn btn-primary"
                                onClick={handleUploadFile} >
                                Upload
                            </button>
                        </div>
                    </div>
                </form>
                <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                    {state.successMessage}
                </div>
            </div>
            }
        </div>
    )
}

export default withRouter(CreateEditQuestionPaper);