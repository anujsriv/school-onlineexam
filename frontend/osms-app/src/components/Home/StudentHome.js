import React, {useState} from 'react';
import { withRouter } from "react-router-dom";
import AnswerPapers from '../AnswerPaper/AnswerPapers';
import PreviousAnswers from '../AnswerPaper/PreviousAnswers';

function StudentHome(props) {

    const [errorMessage, updateErrorMessage] = useState(null);

    return(
        <div style={{width:"1200px"}} className="card">
            <div className="row">
                <div className="col-3">
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a className="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">Upcoming Exam(s)</a>
                        <a className="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Previous Exam(s)</a>
                    </div>
                </div>
                <div className="col-9">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div style={{width:"850px"}} className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                            <AnswerPapers showError={updateErrorMessage} />
                        </div>
                        <div style={{width:"850px"}} className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                            <PreviousAnswers showError={updateErrorMessage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(StudentHome);