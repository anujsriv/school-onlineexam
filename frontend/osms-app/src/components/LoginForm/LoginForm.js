import React, {useState, useEffect} from 'react';
import axios from '../CustomAxios/Axios';
import './LoginForm.css';
import { withRouter } from "react-router-dom";
import UserProfile from '../../closure/UserProfile';

function LoginForm(props) {

    const [schools, setSchools] = useState([]);

    const [userColor, setUserColor] = useState();

    const [passwordColor, setPasswordColor] = useState();

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get('schools/');
        setSchools(response.data);
    }

    const [state , setState] = useState({
        email : "",
        password : "",
        school: "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))

        switch(id) {
            case 'email':
                setUserColor();
                break;
            case  'password' :
                setPasswordColor()
                break;
        }
    }

    const handleSubmitClick = (e) => {
        let oneFailure = false;
        e.preventDefault();
        Array.prototype.forEach.call(e.target.elements, (element) => {
            if (element.checkValidity() === false) {
                oneFailure = true;
                switch(element.id) {
                    case 'email':
                        setUserColor("red");
                        break;
                    case  'password' :
                        setPasswordColor("red")
                        break;
                }
            }
        })

        if (oneFailure) {
            e.stopPropagation();
            props.showError('Field(s) highlighted in red are mandatory.');
        } else {
            setTenantID();
            const payload={
                "userName":state.email,
                "password":state.password,
            }
            axios.post('login', payload)
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
    }

    const setTenantID = () => {
        schools.forEach(function (eachSchool) {
            if (state.school === eachSchool.schoolName) {
                localStorage.setItem('tenantID', eachSchool.tenantID);
                UserProfile.setSchoolName(state.school);
            }
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

    const renderOptions = () => {
        let schoolNames = [];
        schools.forEach(function (eachSchool) {
            schoolNames.push(eachSchool.schoolName);
        });

        return schoolNames.map((key, index) => {
            return <option key={index} value={key}>{key}</option>
        })
    }

    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form noValidate onSubmit={handleSubmitClick}>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">User Name</label>
                <input type="text" 
                       style={{borderColor:userColor}}
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
                       style={{borderColor:passwordColor}}
                       className="form-control" 
                       id="password" 
                       placeholder="Password"
                       value={state.password}
                       onChange={handleChange} 
                       required
                />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="schoolsDropDown">School</label>
                    <select name="schoolsDropDown" 
                            id="school"
                            className="form-control"
                            value={state.school}
                            onChange={handleChange}>
                        {renderOptions()}
                    </select>
                </div>
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
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