import React from 'react';

import NavBar3 from '../components/navBar3.js';
import Tabs from "../components/Tabs"; 
import RegistrationTable2 from "../components/RegistrationTable2.js"

export default class Design extends React.Component {
    render() {
        return(
            <div>
                <NavBar3 displaySideNav="true" content={<RegistrationTable2 />}/>
            </div>
        )
    }
}