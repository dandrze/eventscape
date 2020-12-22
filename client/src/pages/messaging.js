import React, { Component } from 'react';
import NavBar3 from '../components/navBar3.js';
import './messaging.css';
import Chat from "../components/chat4.js";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch1 from "../components/switch";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import AlertModal from "../components/AlertModal";



const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: "20px 0px",
		minWidth: "100%",
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

export default class Messaging extends React.Component {
    render() {
        return(
            <div>
                <NavBar3 displaySideNav="true" content={<Content />}/>
            </div>
        )
    }
}

function Content() {
    const classes = useStyles();
    const [displayName, setDisplayName] = React.useState(
		"Moderator"
    ); 
    const [hideOn, setHideOn] = React.useState({
        checked: false,
    });
    const [navAlertOpen, setNavAlertOpen] = React.useState(false);


    const handleChangeDisplayName = (event) => {
		setDisplayName(event.target.value);
	};
    const handleChange = (event) => {
        setHideOn({ ...hideOn, [event.target.name]: event.target.checked });
    };
    const handleNavAlertOpen = () => {
		setNavAlertOpen(true);
	};
    const handleNavAlertClose = () => {
		setNavAlertOpen(false);
	};
  
        return(
        <div className="mainWrapper container-width">
            <div className="form-box shadow-border" id="chat">
                <div className="chat-container">
                    <Chat />
                </div>
                <div className="chat-options">
                <FormControl variant="outlined" className={classes.formControl}>
					{/* Display Name */}
					<TextField
						id="title"
						label="Display Name"
						variant="outlined"
						value={displayName}
						onChange={handleChangeDisplayName}
					/>
					<br></br>
                    <br></br>
				</FormControl>
                    <Tooltip title="Temporarily hides chat. To permanently remove chat, remove the design block that contains the chat window.">
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch1 checked={hideOn.checked} onChange={handleChange} name="checked" />}
                                label="Temporarily Hide Chat"
                            />
                        </FormGroup>
                    </Tooltip>
                    <button className="Button2" onClick={handleNavAlertOpen}>Delete All Chat Messages</button>
                    <AlertModal
                        open={navAlertOpen}
                        onClose={handleNavAlertClose}
                        onContinue={() => {
                            handleNavAlertClose();
                        }}
                        text="Are you sure you want to delete all chat messages?"
                        closeText="Go back"
                        continueText="Yes, Delete"
                    />
                </div>
            </div>
            <div className="form-box shadow-border">
                <h3>Q&A</h3>
            </div>
        </div>
        )
  };

