import React from 'react';
import { withRouter } from "react-router-dom";
import TeacherTabs from '../Tabs/TeacherTabs';

function TeacherHome(props) {
    return(
        <div className="mt-5">
            <TeacherTabs />
        </div>
    )
}

export default withRouter(TeacherHome);