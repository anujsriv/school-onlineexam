import React from 'react';
import { withRouter } from "react-router-dom";
import StudentTabs from '../Tabs/StudentTabs';

function StudentHome(props) {
    return(
        <div className="mt-5">
            <StudentTabs />
        </div>
    )
}

export default withRouter(StudentHome);