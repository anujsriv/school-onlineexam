import React, {useState, useEffect} from 'react';
import axios from '../CustomAxios/Axios';
import './RegistrationForm.css';
import { withRouter } from "react-router-dom";

function RegistrationForm(props) {

    const [fullNameColor, setFullNameColor] = useState();
    const [userNameColor, setUserNameColor] = useState();
    const [passwordColor, setPasswordColor] = useState();
    const [confirmColor, setConfirmColor] = useState();
    const [schoolColor, setSchoolColor] = useState();

    const [schools, setSchools] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get('schools/');
        setSchools(response.data);
    }

    const [state , setState] = useState({
        fullName : "",
        userName : "",
        password : "",
        confirmPassword: "",
        type : "teacher",
        className : "LKG",
        section : "A",
        school: "ps",
        successMessage: null
    })

    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))

        switch(id) {
            case 'fullName':
                setFullNameColor();
                break;
            case 'userName':
                setUserNameColor();
                break;
            case  'password' :
                setPasswordColor()
                break;
            case  'confirmPassword' :
                setConfirmColor()
                break;
            case 'school' :
                setSchoolColor();
                break;
        }
    }

    const sendDetailsToServer = () => {
        if(state.userName.length && state.password.length) {
            props.showError(null);
            setTenantID();
            const payload={
                "fullName":state.fullName,
                "userName":state.userName,
                "password":state.password,
                "className" : state.className,
                "section" : state.section,
                "type":state.type
            }
            axios.get('users/'+state.userName)
                .then(function (response) {
                    if (response.status === 200) {
                        props.showError("User name "+state.userName+" already taken.");
                    } else {
                        axios.post('users', payload)
                            .then(function (response) {
                                if(response.status === 200){
                                    setState(prevState => ({
                                        ...prevState,
                                        'successMessage' : 'Registration successful. Click on "Login Here" to log into your account.'
                                    }))
                                    //redirectToLogin();
                                    props.showError(null)
                                } else{
                                    props.showError("Some error ocurred");
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                props.showError("Some error ocurred");
                            });
                    }
                })
                .catch(function (error) {
                    axios.post('users', payload)
                        .then(function (response) {
                            if(response.status === 200){
                                setState(prevState => ({
                                    ...prevState,
                                    'successMessage' : 'Registration successful. Click on "Login Here" to log into your account.'
                                }))
                                //redirectToLogin();
                                props.showError(null)
                            } else{
                                props.showError("Some error ocurred");
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                            props.showError("Some error ocurred");
                        });
                })    
        } else {
            props.showError('Please enter valid Username, Password and/ or User Type')    
        }
        
    }

    const setTenantID = () => {
        schools.forEach(function (eachSchool) {
            if (state.school === eachSchool.schoolName) {
                localStorage.setItem('tenantID', eachSchool.tenantID);
            }
        });
    }

    const redirectToLogin = () => {
        props.history.push('/login'); 
    }

    const handleSubmitClick = (e) => {
        if(state.password === state.confirmPassword) {
            let oneFailure = false;
            e.preventDefault();
            Array.prototype.forEach.call(e.target.elements, (element) => {
                if (element.checkValidity() === false) {
                    oneFailure = true;
                    switch(element.id) {
                        case 'fullName':
                            setFullNameColor("red");
                            break;
                        case 'userName':
                            setUserNameColor("red");
                            break;
                        case  'password' :
                            setPasswordColor("red")
                            break;
                        case  'confirmPassword' :
                            setConfirmColor("red")
                            break;
                    }
                } else if (element.type === "select-one" && element.value === "ps") {
                    oneFailure = true;
                    setSchoolColor("red");
                }
            })

            if (oneFailure) {
                e.stopPropagation();
                props.showError('Field(s) highlighted in red are mandatory.');
            } else {
                sendDetailsToServer();
            }

        } else {
            props.showError('Passwords do not match');
        }
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
        <div className="container-fluid d-flex justify-content-center align-items-center flex-column">
            <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
                <form noValidate onSubmit={handleSubmitClick}>
                    <div className="form-group text-left">
                        <label htmlFor="userNameInput">Full Name</label>
                        <input type="text" 
                            style={{borderColor:fullNameColor}}
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
                        style={{borderColor:userNameColor}}
                        className="form-control" 
                        id="userName" 
                        placeholder="Enter user name" 
                        value={state.userName}
                        onChange={handleChange}
                        required
                    />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="schoolsDropDown">School</label>
                        <select name="schoolsDropDown" 
                                style={{borderColor:schoolColor}}
                                id="school"
                                className="form-control"
                                value={state.school}
                                onChange={handleChange}>
                            <option value="ps">---Please Select---</option>
                            {renderOptions()}
                        </select>
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
                        <label htmlFor="classNameDropDown">Class</label>
                        <select name="classNameDropDown" 
                                id="className"
                                className="form-control"
                                value={state.className}
                                onChange={handleChange}>
                            <option value="LKG">LKG</option>
                            <option value="UKG">UKG</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                            <option value="V">V</option>
                            <option value="VI">VI</option>
                            <option value="VII">VII</option>
                            <option value="VIII">VIII</option>
                            <option value="IX">IX</option>
                            <option value="X">X</option>
                            <option value="XI">XI</option>
                            <option value="XII">XII</option>
                        </select>
                    </div>
                        <div className="form-group text-left">
                        <label htmlFor="sectionInput">Section</label>
                        <select name="languageDropDown" 
                                id="section"
                                className="form-control"
                                value={state.section}
                                onChange={handleChange}>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                            <option value="G">G</option>
                            <option value="H">H</option>
                            <option value="I">I</option>
                            <option value="J">J</option>
                            <option value="K">K</option>
                            <option value="L">L</option>
                            <option value="M">M</option>
                            <option value="N">N</option>
                        </select>
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
                        <label htmlFor="exampleInputPassword1">Confirm Password</label>
                        <input type="password" 
                            style={{borderColor:confirmColor}}
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
                        className="btn btn-primary">
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
        </div>
    )
}

export default withRouter(RegistrationForm);