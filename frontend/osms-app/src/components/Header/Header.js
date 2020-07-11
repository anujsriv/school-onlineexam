import React, {useState, useEffect} from 'react';
import { withRouter } from "react-router-dom";
import { isNullOrUndefined } from 'util';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';

function Header(props) {

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        props.updateTitle('Login')
    }

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const redirectToLogin = () => {
        const payload={
            "userName":props.location.state.userName,
            "password":props.location.state.password,
        }
        axios.post(API_BASE_URL+'logout', payload);
        
        props.updateTitle('Login')
        props.history.push('/login');
    }

    const title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
    return(
        <div className="d-flex flex-row justify-content-around bd-highlight mb-3 bg-primary">
            <div className="p-2 bd-highlight text-white">
                {!isNullOrUndefined(props.location.state) &&
                    <div>
                        Welcome {props.location.state.fullName} !
                    </div>
                }
            </div>
            <div className="p-2 bd-highlight">
                <div className="text-white">
                    <span className="h3">{props.title || title}</span>
                </div>
            </div>
            <div className="p-2 bd-highlight">
                {!isNullOrUndefined(props.location.state) &&
                    <button type="button" onClick={redirectToLogin} className="btn text-white btn-link">Logout</button>
                }
            </div>
        </div>
    )
}
export default withRouter(Header);