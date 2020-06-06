import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { withRouter } from "react-router-dom";
import QuestionPapers from '../QuestionPaper/QuestionPapers';

function TeacherTabs(props) {
   return (
        <Tabs>
            <TabList>
                <Tab>Submitted Question Paper(s)</Tab>
                <Tab>Create/ Edit - Question Paper</Tab>
            </TabList>

            <TabPanel>
                <QuestionPapers />
            </TabPanel>
            <TabPanel>
                <h2>Any content 2</h2>
            </TabPanel>
        </Tabs>
    )
}

export default withRouter(TeacherTabs);