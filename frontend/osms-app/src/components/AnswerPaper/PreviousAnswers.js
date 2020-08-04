import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import UserProfile from '../../closure/UserProfile';
import axios from '../CustomAxios/Axios';
import DetailIcon from '../Images/marks_details.png';
import PassIcon from '../Images/pass.png';
import FailIcon from '../Images/fail.png';

function PreviousAnswer(props) {

    const [answerPapers, setAnswerPapers] = useState([]);

    const [answerPaper, setAnswerPaper] = useState({});

    useEffect(() => {
        getData()
        const interval = setInterval(() => {
            getData()
          }, 10000);
          return () => clearInterval(interval);
    }, [])

    const getData = async () => {
        
        axios.get('answerpaper/'+UserProfile.getId())
            .then(function (response){
                if (response.status === 200) {
                    setAnswerPapers(response.data);
                }
            })
    }

    const getAnswerDetails = (id) => {
        answerPapers.forEach(function (eachAnswerPaper){
            if (eachAnswerPaper.id === id) {
                setAnswerPaper(eachAnswerPaper);
            }
        })

    }

    const renderQAList = () => {
        return answerPaper.qas && answerPaper.qas.map(function (eachQuestion) {
            return (
                <li className="list-group-item" key={eachQuestion.id}>
                    <label className="font-weight-bold">Question</label>
                    <br></br>
                    <label className="font-weight-normal">{eachQuestion.question}</label>
                    <br></br>
                    <label className="font-weight-bold">Answer</label>
                    <br></br>
                    <p className="font-weight-normal">{eachQuestion.answer}</p>
                    <br></br>
                    <form className="form-inline">
                        <label className="form-control mb-2 mr-sm-2 font-weight-bold">Evaluation : {eachQuestion.correctIncorrect}</label>
                        <label className="form-control mb-2 mr-sm-2 font-weight-bold">Marks : {eachQuestion.marksObtained}</label>
                        <label className="form-control mb-2 mr-sm-2 font-weight-bold">Total Marks : {eachQuestion.fullMarks}</label>
                    </form>
                </li>
            )
        });
    }

    const renderHeader = () => {
        let headerElement = ['#', 'subject', 'full marks', 'pass marks', 'marks obtained', 'result', 'details']

        return headerElement.map((key, index) => {
            return <th scope="col" key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return answerPapers && answerPapers.map(({ id, subject, fullMarks, passMarks, totalMarksObtained, result}) => {
            return (
                <tr key={id}>
                    <th scope="row">{id}</th>
                    <td>{subject}</td>
                    <td>{fullMarks}</td>
                    <td>{passMarks}</td>
                    <td>{totalMarksObtained}</td>
                    <td>{result === 'pass' ? <img src={PassIcon} alt='' width="30" height="30" title="Congratulations !" />
                    : <img src={FailIcon} alt='' width="30" height="30" title="Better luck next time." />
                    }
                    </td>
                    <td>
                        <img src={DetailIcon} alt='' style={{cursor:'pointer'}} width="30" height="30" data-toggle="modal" data-target="#exampleModalLong" onClick={() => getAnswerDetails(id)} title="Click here to see detailed answer sheet." />
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <div className="card-body text-center">
                <h4 className="card-title">Previous Answer Paper(s)</h4>
                <table className="table table-hover">
                    <thead>
                        <tr className="table-primary">{renderHeader()}</tr>
                    </thead>
                    <tbody>
                        {renderBody()}
                    </tbody>
                </table>
            </div>
            <div className="modal fade bd-example-modal-lg" id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Detailed answer sheet</h5>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group list-group-flush">
                            {renderQAList()}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default withRouter(PreviousAnswer);