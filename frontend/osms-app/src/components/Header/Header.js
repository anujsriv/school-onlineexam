import React from 'react';
import { withRouter } from "react-router-dom";
import axios from '../CustomAxios/Axios';
import UserProfile from '../../closure/UserProfile';

function Header(props) {

    const redirectToLogin = () => {
        const payload={
            "userName":UserProfile.getUserName(),
            "password":UserProfile.getPassword()
        }
        axios.post('logout', payload)
            .then(response => {
                if (response.status === 200) {
                    updateUserData();
                    props.updateTitle('Login')
                    props.history.push('/login');
                }
        })
        .catch( function (error){
            console.log(error);
        });
        
        updateUserData();
        props.updateTitle('Login')
        props.history.push('/login');
    }

    const updateUserData = () => {
        UserProfile.setFullName("");
        UserProfile.setUserName("");
        UserProfile.setPassword("");
        UserProfile.setId("");
        UserProfile.setSchoolName("");
    }

    const title = UserProfile.getSchoolName();

    return(
        <div className="d-flex flex-row justify-content-around bd-highlight mb-3 bg-primary">
            <div className="p-2 bd-highlight text-white">
                {!!UserProfile.getFullName() &&
                    <div>
                        Welcome {UserProfile.getFullName()}
                    </div>
                }
            </div>
            <div className="p-2 bd-highlight">
                <div className="text-white">
                    <span className="h3">{title}</span>
                </div>
            </div>
            <div className="p-2 bd-highlight">
                {!!(UserProfile.getFullName()) &&
                    <button type="button" onClick={redirectToLogin} className="btn text-white btn-link">Logout</button>
                }
            </div>
        </div>
    )
}
export default withRouter(Header);