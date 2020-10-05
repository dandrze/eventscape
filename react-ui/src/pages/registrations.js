import React from 'react';

import NavBar3 from '../components/navBar3.js';
import Tabs from "../components/Tabs"; 
import RegistrationTable2 from "../components/RegistrationTable2.js"

export default class Design extends React.Component {
    render() {
        return(
            <div>
                <NavBar3 displaySideNav="true" content={
                    <div className="container-width">
                        <RegistrationTable2 />
                        <div style={{color: "#F8F8F8"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                    </div>
                }/>
            </div>
        )
    }
}