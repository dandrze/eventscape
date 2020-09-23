import React from 'react';
import NavBar from '../components/navbar.js';
import MiniDrawer from "../components/navbar2.js";
import NavBarSide from '../components/navbarside.js'
import NavBar3 from '../components/navBar3.js'

export default class Dashboard extends React.Component {
    render() {
        return(
            <div>
                <NavBar3 displaySideNav="true"/>
            <h1>I'm a dashboard</h1>
            </div>
        )
    }
}