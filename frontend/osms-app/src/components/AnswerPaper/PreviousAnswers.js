import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import UserProfile from '../../closure/UserProfile';
import axios from '../CustomAxios/Axios';

function PreviousAnswer(props) {

    const [answerPapers, setAnswerPapers] = useState([]);

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

    const renderHeader = () => {
        let headerElement = ['#', 'question paper', 'status']

        return headerElement.map((key, index) => {
            return <th scope="col" key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return answerPapers && answerPapers.map(({ id, questionPaperID, status}) => {
            return (
                <tr key={id}>
                    <th scope="row">{id}</th>
                    <td>{questionPaperID}</td>
                    <td>{status}</td>
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
        </>
    )

}

export default withRouter(PreviousAnswer);