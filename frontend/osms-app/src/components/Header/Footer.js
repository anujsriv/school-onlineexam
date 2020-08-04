import React from 'react';
import { withRouter } from "react-router-dom";

function Footer() {
    return (
        <div className="fixed-bottom d-flex flex-row justify-content-around bd-highlight bg-primary">
           <div className="p-2 bd-highlight text-white">
                <div>
                    prarat.com
                </div>
            </div>
            <div className="p-2 bd-highlight">
                <div className="text-white">
                    Copyright
                </div>
            </div>
            <div className="p-2 bd-highlight">
                
            </div>
        </div>
    );
}

export default withRouter(Footer);