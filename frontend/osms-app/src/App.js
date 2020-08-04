import React, {useState} from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Header/Footer';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import TeacherHome from './components/Home/TeacherHome';
import StudentHome from './components/Home/StudentHome';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AlertComponent from './components/AlertComponent/AlertComponent';  
import StartExam from './components/Exam/StartExam';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router>
    <div className="App">
      <Header title={title} updateTitle={updateTitle}/>
        <div className="container-fluid align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/register">
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/teacherhome" >
              <TeacherHome showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/studenthome" >
              <StudentHome showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/studentstartexam" >
              <StartExam showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
        <br></br>
      <Footer />
    </div>
    </Router>
  );
}

export default App;