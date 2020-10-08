import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import "./event-details.css";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { HexColorPicker, HexColorInput } from "react-colorful";
import "react-colorful/dist/index.css";
import * as actions from "../actions";

class Event_Details extends React.Component {
	render() {
		return (
			<div>
				<h1>My Event Details</h1>
				<div className="form-box shadow-border">
					<TitleLink />
					<EventCatSelect />
					<DateTimePickers />
					<br></br>
					<label for="primary-color">Primary Color</label>
					<br></br>
					<label for="primary-color">
						Tip: picking a darker color will help buttons stand out.
					</label>
					<EventColor />
					<br></br>
					<Link to="/Design">
						<button className="Button1" onClick={this.props.createModel}>
							Create My Event
						</button>
					</Link>
				</div>
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

function TitleLink() {
	const classes = useStyles();

	return (
		<div>
			<FormControl variant="outlined" className={classes.formControl}>
				<TextField id="title" label="Event Title" variant="outlined" />
				<br></br>
				<TextField
					id="event-link"
					label="Event Link"
					variant="outlined"
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">.eventscape.io</InputAdornment>
						),
					}}
				/>
			</FormControl>
		</div>
	);
}

function EventCatSelect() {
	const classes = useStyles();
	const [eventType, setEventType] = React.useState("");

	const handleChange = (event) => {
		setEventType(event.target.value);
	};

	return (
		<div>
			<FormControl variant="outlined" className={classes.formControl}>
				<InputLabel id="event-type">Category</InputLabel>
				<Select
					labelId="event-type"
					id="event-type-select"
					required="true"
					value={eventType}
					onChange={handleChange}
				>
					<MenuItem value="">
						<em>Select Category</em>
					</MenuItem>
					<MenuItem value={"business_professional"}>
						Business & Professional
					</MenuItem>
					<MenuItem value={"charity_causes"}>Charity & Causes</MenuItem>
					<MenuItem value={"education"}>Education</MenuItem>
					<MenuItem value={"fashion"}>Fashion</MenuItem>
					<MenuItem value={"government_politics"}>
						Government & Politics
					</MenuItem>
					<MenuItem value={"music"}>Music</MenuItem>
					<MenuItem value={"performing_visual_arts"}>
						Performing & Visual Arts
					</MenuItem>
					<MenuItem value={"religion_spirituality"}>
						Religion & Spirituality
					</MenuItem>
					<MenuItem value={"other"}>Other</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
}

function DateTimePickers() {
	// Start Date
	const [selectedStartDate, setSelectedStartDate] = React.useState(
		new Date("2020-11-18T19:00:00")
	);

	const handleStartDateChange = (date) => {
		setSelectedStartDate(date);
	};

	//End Date
	const [selectedEndDate, setSelectedEndDate] = React.useState(
		new Date("2020-11-18T21:00:00")
	);

	const handleEndDateChange = (date) => {
		setSelectedEndDate(date);
	};

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<KeyboardDatePicker
						label="Start Date"
						disableToolbar
						inputVariant="outlined"
						format="MM/dd/yyyy"
						margin="normal"
						id="event-start-date"
						value={selectedStartDate}
						onChange={handleStartDateChange}
						KeyboardButtonProps={{
							"aria-label": "change date",
						}}
					/>
				</Grid>
				<Grid item xs={6}>
					<KeyboardTimePicker
						label="Start Time"
						margin="normal"
						id="event-start-time"
						inputVariant="outlined"
						value={selectedStartDate}
						onChange={handleStartDateChange}
						KeyboardButtonProps={{
							"aria-label": "change time",
						}}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<KeyboardDatePicker
						label="End Date"
						disableToolbar
						inputVariant="outlined"
						variant="inline"
						format="MM/dd/yyyy"
						margin="normal"
						id="event-end-date"
						value={selectedEndDate}
						onChange={handleEndDateChange}
						KeyboardButtonProps={{
							"aria-label": "change date",
						}}
					/>
				</Grid>
				<Grid item xs={6}>
					<KeyboardTimePicker
						label="End Time"
						margin="normal"
						id="event-end-time"
						inputVariant="outlined"
						value={selectedEndDate}
						onChange={handleEndDateChange}
						KeyboardButtonProps={{
							"aria-label": "change time",
						}}
					/>
				</Grid>
			</Grid>
		</MuiPickersUtilsProvider>
	);
}

const EventColor = () => {
	const [color, setColor] = useState("#B0281C");
	return (
		<div>
			<HexColorPicker color={color} onChange={setColor} id="event-color" />
			<HexColorInput color={color} onChange={setColor} id="hex-input" />
		</div>
	);
};

export default connect(null, actions)(Event_Details);
