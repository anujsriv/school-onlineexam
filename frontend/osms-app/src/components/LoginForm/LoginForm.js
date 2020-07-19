import React, {useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import UserProfile from '../../closure/UserProfile';

function LoginForm(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload={
            "userName":state.email,
            "password":state.password,
        }
        axios.post(API_BASE_URL+'login', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    saveUserData(response.data);
                    redirectToHome(response.data);
                    props.showError(null)
                }
                else if(response.status === 404){
                    props.showError("Login failed: Invalid username or password.");
                }
                else if(response.status === 403){
                    props.showError(response.message);
                }
            })
            .catch(function (error) {
                console.log(error.response);
                props.showError(error.response.data);
            });
    }

    const saveUserData = (user) => {
        UserProfile.setFullName(user.fullName);
        UserProfile.setUserName(user.userName);
        UserProfile.setPassword(user.password);
        UserProfile.setId(user.id);
    }

    const redirectToHome = (data) => {
        if(data.type === 'teacher'){
            props.updateTitle('Home')
            props.history.push('/teacherhome', data);
        } else{
            props.updateTitle('Home')
            props.history.push('/studenthome', data);
        }
    }

    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }

    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">User Name</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="Enter User Name" 
                       value={state.email}
                       onChange={handleChange}
                       required
                />
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
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Don't have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
            </div>
        </div>
    )
}

export default withRouter(LoginForm);