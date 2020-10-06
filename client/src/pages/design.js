import React from 'react';

import NavBar3 from '../components/navBar3.js';
import RegPageEditor from '../components/regPageEditor';

export default class Design extends React.Component {
    render() {
        return(
            <div>
                <NavBar3 displaySideNav="true" content={<RegPageEditor />}/>
            </div>
        )
    }
}