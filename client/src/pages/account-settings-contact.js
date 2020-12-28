import React from "react";
import NavBar3 from "../components/navBar3.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: "20px 0px",
		minWidth: "100%",
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

function AccountSettings () {
	const classes = useStyles();

	const [fName, setFName] = React.useState("");
	const [lName, setLName] = React.useState("");
	const [email, setEmail] = React.useState("");

	const handleChangeEmail = (event) => {
		setEmail(event.target.value);
	};

	const handleChangeFName = (event) => {
		setFName(event.target.value);
	};

	const handleChangeLName = (event) => {
		setLName(event.target.value);
	};

		return (
			<div>
				<NavBar3
					displaySideNav="false"
					displaySideNavAccount="true"
					highlight="contact"
					content={
						<div className="form-box shadow-border form-width">
							<h3>Contact Details</h3>
							<br></br>
							<FormControl variant="outlined" className={classes.formControl}>
								<TextField 
									type="text" 
									id="f-name" 
									label="First Name" 
									variant="outlined" 
									value={fName}
									onChange={handleChangeFName}
								/>
							</FormControl>
							<br></br>
							<FormControl variant="outlined" className={classes.formControl}>
								<TextField 
									type="text" 
									id="l-name" 
									label="Last Name" 
									variant="outlined" 
									value={lName}
									onChange={handleChangeLName}
								/>
							</FormControl>
							<br></br>
							<FormControl variant="outlined" className={classes.formControl}>
								<TextField 
									type="email" 
									id="email" 
									label="Email" 
									variant="outlined" 
									value={email}
									onChange={handleChangeEmail}
								/>
							</FormControl>
							<br></br>
							<br></br>
							<Link to="/event-details">
								<button className="Button1" type="submit">
									Update Contact
								</button>
							</Link>
						</div>
					}
				/>
			</div>
		);
}

const mapStateToProps = (state) => {
	return { event: state.event };
};

export default connect(mapStateToProps, null)(AccountSettings);
