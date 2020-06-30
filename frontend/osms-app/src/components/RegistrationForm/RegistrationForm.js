import React, {useState} from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";

function RegistrationForm(props) {
    const [state , setState] = useState({
        fullName : "",
        userName : "",
        password : "",
        confirmPassword: "",
        type : "teacher",
        className : "",
        section : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const sendDetailsToServer = () => {
        if(state.userName.length && state.password.length) {
            props.showError(null);
            const payload={
                "fullName":state.fullName,
                "userName":state.userName,
                "password":state.password,
                "className" : state.className,
                "section" : state.section,
                "type":state.type
            }
            axios.post(API_BASE_URL+'users', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Redirecting to home page..'
                        }))
                        redirectToHome(response.data);
                        props.showError(null)
                    } else{
                        props.showError("Some error ocurred");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    props.showError("Some error ocurred");
                });    
        } else {
            props.showError('Please enter valid Username, Password and/ or User Type')    
        }
        
    }
    const redirectToHome = (data) => {
        if(state.type === 'teacher'){
            props.updateTitle('Home')
            props.history.push('/teacherhome', data);
        } else{
            props.updateTitle('Home')
            props.history.push('/studenthome', data);
        }
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.password === state.confirmPassword) {
            sendDetailsToServer()    
        } else {
            props.showError('Passwords do not match');
        }
    }
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="userNameInput">Full Name</label>
                    <input type="text" 
                        className="form-control" 
                        id="fullName"
                        aria-describedby="fullNameHelp"  
                        placeholder="Enter Full Name" 
                        value={state.fullName}
                        onChange={handleChange} 
                        required
                    />
                    <small id="fullNameHelp" className="form-text text-muted">Please enter full name as: [FIRST NAME] [MIDDLE NAME] [LAST NAME]</small>
                </div>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">User Name</label>
                <input type="text" 
                       className="form-control" 
                       id="userName" 
                       placeholder="Enter user name" 
                       value={state.userName}
                       onChange={handleChange}
                       required
                />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="userTypeDropDown">User Type</label>
                    <select name="userTypeDropDown" 
                            id="type"
                            className="form-control"
                            value={state.type}
                            onChange={handleChange}>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="classNameInput">Class</label>
                    <input type="text" 
                        className="form-control" 
                        id="className" 
                        placeholder="Enter Class" 
                        value={state.className}
                        onChange={handleChange} 
                        required />
                </div>
                    <div className="form-group text-left">
                    <label htmlFor="sectionInput">Section</label>
                    <input type="text" 
                        className="form-control" 
                        id="section" 
                        placeholder="Enter Section" 
                        value={state.section}
                        onChange={handleChange} 
                        required />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        placeholder="Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange} 
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Register
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
            </div>
            
        </div>
    )
}

export default withRouter(RegistrationForm);