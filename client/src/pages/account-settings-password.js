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

function AccountSettingsPassword () {
	const classes = useStyles();

	const [currentPassword, setCurrentPassword] = React.useState("");
	const [newPassword, setNewPassword] = React.useState("");
	const [confirmNewPassword, setConfirmNewPassword] = React.useState("");


	const handleChangeCurrentPassword = (event) => {
		setCurrentPassword(event.target.value);
	};

	const handleChangeNewPassword = (event) => {
		setNewPassword(event.target.value);
	};

	const handleChangeConfirmNewPassword = (event) => {
		setConfirmNewPassword(event.target.value);
	};

	return (
		<div>
			<NavBar3
				displaySideNav="false"
				displaySideNavAccount="true"
				highlight="password"
				content={
					<div className="form-box shadow-border form-width">
						<h3>Update Password</h3>
						<br></br>
						<FormControl variant="outlined" className={classes.formControl}>
							<TextField
								type="password"
								id="current-password"
								label="Current Password"
								variant="outlined"
								value={currentPassword}
								onChange={handleChangeCurrentPassword}
							/>
						</FormControl>
						<br></br>
						<FormControl variant="outlined" className={classes.formControl}>
							<TextField
								type="password"
								id="new-password"
								label="New Password"
								variant="outlined"
								value={newPassword}
								onChange={handleChangeNewPassword}
							/>
						</FormControl>
						<br></br>
						<FormControl variant="outlined" className={classes.formControl}>
							<TextField
								type="password"
								id="confirm-new-password"
								label="Confirm New Password"
								variant="outlined"
								value={confirmNewPassword}
								onChange={handleChangeConfirmNewPassword}
							/>
						</FormControl>
						<br></br>
						<br></br>
						<Link to="/event-details">
							<button className="Button1" type="submit">
								Save
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

export default connect(mapStateToProps, null)(AccountSettingsPassword);
