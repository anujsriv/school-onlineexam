import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";

function StartExam(props) {

    const [questionPaper, setQuestionPaper] = useState([]);
    const [question, setQuestion] = useState([]);

    const [state , setState] = useState({
        pageNumber : 0
    })

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get(API_BASE_URL+'questionpaper/'+props.location.state.questionPaperID);
        setQuestionPaper(response.data);
    }

    const handleNextClick = (e) => {
        e.preventDefault();
        const response = axios.get(API_BASE_URL+'question/'+props.location.state.questionPaperID+'/'+state.pageNumber);
        setQuestion(response.data);
        state.pageNumber = state.pageNumber + 1;

        console.log(response.data);
        console.log(state.pageNumber);
    }

    return(
        <div className="card text-left">
            <h5 className="card-header ">General Instructions</h5>
            <div className="card-body">
                <p className="card-text">{questionPaper.instructions} Please click on 'Next' to start your exam.</p>
                <button type="submit" className="btn btn-primary" onClick={handleNextClick} >Next ></button>
            </div>
        </div>
    )
}

export default withRouter(StartExam);