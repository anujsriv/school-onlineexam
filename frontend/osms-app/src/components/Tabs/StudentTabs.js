import React, {useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { withRouter } from "react-router-dom";
import AnswerPapers from '../AnswerPaper/AnswerPapers';

function StudentTabs(props) {

    return (
        <Tabs>
            <TabList>
                <Tab>Upcoming Exam(s)</Tab>
                <Tab>Previous Exam(s)</Tab>
            </TabList>

            <TabPanel>
                <AnswerPapers />
            </TabPanel>
            <TabPanel>
                <div>Under Construction</div>
            </TabPanel>
        </Tabs>
    )
}

export default withRouter(StudentTabs);