import React, {useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { withRouter } from "react-router-dom";
import QuestionPapers from '../QuestionPaper/QuestionPapers';
import CreateEditQuestionPaper from '../QuestionPaper/CreateEditQuestionPaper';
import AlertComponent from '../AlertComponent/AlertComponent';

function TeacherTabs(props) {
   const [errorMessage, updateErrorMessage] = useState(null);
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
                <CreateEditQuestionPaper showError={updateErrorMessage} />
                <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
            </TabPanel>
        </Tabs>
    )
}

export default withRouter(TeacherTabs);