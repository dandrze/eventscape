import React from 'react';

import NavBar3 from '../components/navBar3.js';
import Tabs from "../components/Tabs"; 
import Event_Details from "./event-details";

export default class WebsiteSettings extends React.Component {
    render() {
        return(
            <div>
                <NavBar3 displaySideNav="true" content={
                    <div>
                    <Event_Details />
                    </div>
                }/>
            </div>
        )
    }
}