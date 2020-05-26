import React from 'react';
import { withRouter } from "react-router-dom";
import { isNullOrUndefined } from 'util';

function Header(props) {
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
    }

    const title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
    return(
        <nav className="navbar navbar-dark bg-primary">
            {!isNullOrUndefined(props.location.state) &&
            <div className="row col-11 d-flex justify-content-left text-white">
                Welcome {props.location.state.userName} !
            </div>}
            <div className="row col-12 d-flex justify-content-center text-white">
                <span className="h3">{props.title || title}</span>
            </div>
            {!isNullOrUndefined(props.location.state) &&
            <div className="row col-13 d-flex justify-content-right text-white" onClick={() => redirectToLogin()}>
                Logout
            </div>}
        </nav>
    )
}
export default withRouter(Header);