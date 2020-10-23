import React from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

export default class Create_Account extends React.Component {
	render() {
		return (
			<div className="form-box">
				<h1>
					Create your<br></br>free account to<br></br>continue.
				</h1>
				<EmailPassword />
				<br></br>
				<Link to="/Event_Details">
					<button className="Button1" type="submit">
						Create My Account
					</button>
				</Link>

				<form action="/login" method="post">
					<div>
						<label>Username:</label>
						<input type="text" name="username" />
					</div>
					<div>
						<label>Password:</label>
						<input type="password" name="password" />
					</div>
					<div>
						<input type="submit" value="Log In" />
					</div>
				</form>
			</div>
		);
	}
}

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: "20px 0px",
		minWidth: "100%",
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

function EmailPassword() {
	const classes = useStyles();

	return (
		<div>
			<FormControl variant="outlined" className={classes.formControl}>
				<TextField type="email" id="email" label="Email" variant="outlined" />
				<br></br>
				<TextField
					type="password"
					id="password"
					label="Password"
					variant="outlined"
				/>
			</FormControl>
		</div>
	);
}
