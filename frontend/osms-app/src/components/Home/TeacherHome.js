import React, {useState} from 'react';
import { withRouter } from "react-router-dom";
import QuestionPapers from '../QuestionPaper/QuestionPapers';
import CreateEditQuestionPaper from '../QuestionPaper/CreateEditQuestionPaper';
import AlertComponent from '../AlertComponent/AlertComponent';


function TeacherHome(props) {

    const [errorMessage, updateErrorMessage] = useState(null);

    return(
        <div style={{width:"1200px"}} className="card">
            <div className="row">
                <div className="col-3">
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a className="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">Home</a>
                        <a className="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">New Question Paper</a>
                    </div>
                </div>
                <div className="col-9">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div style={{width:"850px"}} className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                            <QuestionPapers showError={updateErrorMessage} />
                        </div>
                        <div style={{width:"850px"}} className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                            <CreateEditQuestionPaper showError={updateErrorMessage} />
                            <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(TeacherHome);