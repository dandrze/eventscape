import React from "react";
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

function Create_Account() {
	const classes = useStyles();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const handleChangeEmail = (event) => {
		setEmail(event.target.value);
	};

	const handleChangePassword = (event) => {
		setPassword(event.target.value);
	};

	return (
		<div className="form-box shadow-border">
			<h1>
				Create your<br></br>free account to<br></br>continue.
			</h1>
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
			<FormControl variant="outlined" className={classes.formControl}>
				<TextField
					type="password"
					id="password"
					label="Password"
					variant="outlined"
					value={password}
					onChange={handleChangePassword}
				/>
			</FormControl>
			<br></br>
			<br></br>
			<Link to="/event-details">
				<button className="Button1" type="submit">
					Create My Account
				</button>
			</Link>
		</div>
	);
}

export default Create_Account;

