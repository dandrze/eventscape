import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { Select, withTheme } from '@material-ui/core';

import "./Giller.css";
import SGPlogo from "../Giller/SGP-Website-Logo-2019.jpg";
import { isWithinInterval } from "date-fns";

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: "20px 0px",
		width: "150px",
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
		
	},
	dropdownStyle: {
      border: "1px solid white",
    },
}));

function Giller(props) {
	const classes = useStyles();
	const [captions, setCaptions] = React.useState("off");
	let videoSRC = "https://www.youtube.com/embed/MnrJzXM7a6o?modestbranding=1;showinfo=0;rel=0"


	const handleChangeCaptions = (event) => {
		setCaptions(event.target.value);
		console.log('captions: ' + videoSRC)
		
	};

	function setSRC() {

	}

	return (
		<div className="scroll">
			<div className="headerContainer">
				<img src={SGPlogo} className="logo"></img>
			</div>

			<div className="mainContainer">
				<div className="videoContainer">
					<div className="video-responsive">
						{captions === "off" ? (
							<iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/X9llog6QNVM?modestbranding=1;showinfo=0;rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : null}
						{captions === "english" ? (
							<iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/1qZXHVDZX2A?modestbranding=1;showinfo=0;rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : null}
						{captions === "french" ? (
							<iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/LHKyYhtbhW8?modestbranding=1;showinfo=0;rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : null}
						{captions === "spanish" ? (
							<iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/0obzO0ybBos?modestbranding=1;showinfo=0;rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : null}
					</div>

					<div className="selectContainer">
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="caption-label"></InputLabel>
							<Select
								labelId="caption-label"
								id="caption-select"
								value={captions}
								onChange={handleChangeCaptions}
								className={classes.dropdownStyle}							>
								<MenuItem value={"off"}>Captions Off</MenuItem>
								<MenuItem value={"english"}>English</MenuItem>
								<MenuItem value={"french"}>Français</MenuItem>
								<MenuItem value={"spanish"}>Español</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div className="paragraph">
						<p>Hosted by Jael Richardson, Between the Pages: An Evening with the Scotiabank Giller Prize Finalists will be an hour of readings, questions and answers and will take you inside the minds and creatives lives of the writers on the 2020 shortlist.</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Giller;