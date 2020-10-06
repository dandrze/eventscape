import React from 'react';
import logo from './triangular-logo.svg';
import list_icon from './list.svg';
import plus_icon from './plus.svg';
import user_icon from './user.svg';
import Tooltip from "@material-ui/core/Tooltip";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';


function NavBar() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return(
        <nav className='navbar'>
            <ul className='navbar_nav'>
                <a href='/' className='navbar_logo'>
                    <img src={logo} alt="logo" height='30px'></img>
                </a>
                <a href="/My_Events" className='navbar_list_icon'>
                    <Tooltip
                        title="Switch Event"
                        placement="top"
                    >
                        <img src={list_icon} alt="list icon" height='30px'></img>
                    </Tooltip>
                </a>
                <a href="/My_Events">
                    <Tooltip
                        title="Switch Event"
                        placement="top"
                    >
                        <div className='navbar_current_event'>Current event</div>
                    </Tooltip>
                </a>
                <div className='spacer'></div>
                <a href="/Event_Details" className='plus_icon'>
                    <Tooltip
                        title="Create New Event"
                        placement="top"
                    >
                        <img src={plus_icon} alt="add event" height="28px"></img>
                    </Tooltip>
                </a>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <img className='profile' src={user_icon} alt="user" height="30px"></img>
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </ul>
        </nav>
    );
};

export default NavBar;