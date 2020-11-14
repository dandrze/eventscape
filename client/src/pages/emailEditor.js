import React, { Component } from "react";
import NavBar3 from "../components/navBar3.js";
import "./emailEditor.css";
import BootstrapInput from "../components/selectInput";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import EmailList from "../components/emailList";
import SendTestEmail from "../components/sendTestEmail";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import FroalaEmail from "../components/froalaEmail";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Cancel from "../icons/cancel.svg";
import { Hidden } from "@material-ui/core";

export default class EmailEditor extends React.Component {
	render() {
		return (
			<div>
				<NavBar3 displaySideNav="true" content={<Content />} />
			</div>
		);
	}
}

class Content extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div>
				<Link to="./communication" id="cancelBar">
					<Tooltip title="Close Editor">
						<img src={Cancel} id="cancelIcon" height="24px"></img>
					</Tooltip>
				</Link>
				<div className="design">
					<div id="topButtons">
						<SendTestEmail />
						<div id="status">
							<StatusSelect />
						</div>
						<button className="Button1" id="save">
							Save
						</button>
					</div>

					<div id="designBoard">
						<div style={{ overflow: "hidden" }}>
							<div id="emailInputs">
								<div className="inputDiv">
									<label htmlFor="toSelect" id="emailLabel">
										To:{" "}
									</label>
									<div id="toSelect">
										<ToSelect />
									</div>
								</div>

								<div className="inputDiv">
									<label htmlFor="from" id="emailLabel">
										From:{" "}
									</label>
									<input
										type="text"
										id="emailInput"
										name="from"
										placeholder=""
									></input>
									<br></br>
								</div>

								<div className="inputDiv">
									<label htmlFor="subject" id="emailLabel">
										Subject:{" "}
									</label>
									<input
										type="text"
										id="emailInput"
										name="subject"
										placeholder=""
										value="Thank You for Registering for {Event_Name}"
									></input>
								</div>

								<div className="inputDiv">
									<label htmlFor="sendTime" id="emailLabel">
										Scheduled Send Time:{" "}
									</label>
									<br></br>
									<DateTimePickers />
								</div>
							</div>

							<div style={{ margin: "3%" }}>
								<FroalaEmail />
							</div>
						</div>
					</div>
					<div style={{ color: "#F8F8F8" }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</div>
				</div>
			</div>
		);
	}
}

/*for select input*/
const useStyles = makeStyles((theme) => ({
	margin: {
		margin: 0,
	},
}));

function StatusSelect() {
	const classes = useStyles();
	const [status, setStatus] = React.useState("draft");
	const handleChange = (event) => {
		setStatus(event.target.value);
	};
	return (
		<div>
			<FormControl className={classes.margin}>
				<InputLabel id="demo-customized-select-label">Status</InputLabel>
				<Select
					labelId="demo-customized-select-label"
					id="demo-customized-select"
					value={status}
					onChange={handleChange}
					input={<BootstrapInput />}
				>
					<MenuItem value={"active"}>Active</MenuItem>
					<MenuItem value={"draft"}>Draft</MenuItem>
					<MenuItem value={"disabled"}>Disabled</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
}

function ToSelect() {
	const classes = useStyles();
	const [to, setTo] = React.useState("newRegistrants");
	const handleChange = (event) => {
		setTo(event.target.value);
	};

	return (
		<div>
			<FormControl className={classes.margin}>
				<Select
					labelId="demo-customized-select-label"
					id="demo-customized-select"
					value={to}
					onChange={handleChange}
					input={<BootstrapInput />}
				>
					<MenuItem value={"emailList"}>Email List</MenuItem>
					<MenuItem value={"newRegistrants"}>New Registrants</MenuItem>
					<MenuItem value={"allRegistrants"}>All Registrants</MenuItem>
				</Select>
			</FormControl>
			<div id="editEmailList">{to === "emailList" ? <EmailList /> : null}</div>
		</div>
	);
}

/*for date time picker*/

function DateTimePickers() {
	// The first commit of Material-UI
	const [selectedDate, setSelectedDate] = React.useState(
		new Date("2014-08-18T21:11:54")
	);

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<KeyboardDatePicker
				disableToolbar
				variant="inline"
				format="MM/dd/yyyy"
				margin="normal"
				id="date-picker-inline"
				value={selectedDate}
				onChange={handleDateChange}
				KeyboardButtonProps={{
					"aria-label": "change date",
				}}
			/>
			<KeyboardTimePicker
				margin="normal"
				id="time-picker"
				value={selectedDate}
				onChange={handleDateChange}
				KeyboardButtonProps={{
					"aria-label": "change time",
				}}
			/>
		</MuiPickersUtilsProvider>
	);
}
