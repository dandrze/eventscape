import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { Select, withTheme } from '@material-ui/core';
import { Helmet } from 'react-helmet'
import Favicon from 'react-favicon';

import "./Giller.css";
import SGPlogo from "../Giller/SGP-Website-Logo-2019.jpg";
import ScotiaLogo from "../Giller/ScotiaWM_logo_E_R_HEX_small.png";
import SGPfavicon from "../Giller/SGPfavicon.ico";
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

	const handleChangeCaptions = (event) => {
		setCaptions(event.target.value);
	};

	return (
		<div>
			<Helmet>
          		<title>Scotiabank Giller Prize</title>
        	</Helmet>
			<Favicon url={SGPfavicon} />

			<div className="headerContainer">
				<img src={SGPlogo} className="logo"></img>
			</div>

			<div className="mainContainer">
				<div className="videoContainer">
					<div className="video-responsive">
						{captions === "off" ? (
							<iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/SIYdaGHPTtQ?modestbranding=1;showinfo=0;rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : null}
						{captions === "english" ? (
							<iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/9f-8JKBGgr0?modestbranding=1;showinfo=0;rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : null}
						{captions === "french" ? (
							<iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/idjYG4B28No?modestbranding=1;showinfo=0;rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : null}
						{captions === "spanish" ? (
							<iframe id="video-responsive-iframe" src="https://www.youtube.com/embed/lWsOw5xv2jE?modestbranding=1;showinfo=0;rel=0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : null}
					</div>

					<div className="selectContainer">
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="caption-label">Captions</InputLabel>
							<Select
								labelId="caption-label"
								id="caption-select"
								value={captions}
								onChange={handleChangeCaptions}
								className={classes.dropdownStyle}							>
								<MenuItem value={"off"}>Off</MenuItem>
								<MenuItem value={"english"}>English</MenuItem>
								<MenuItem value={"french"}>Français</MenuItem>
								<MenuItem value={"spanish"}>Español</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div id="paragraph">
						<p>Hosted by Jael Richardson, Between the Pages: An Evening with the Scotiabank Giller Prize Finalists will be an hour of readings, questions and answers and will take you inside the minds and creatives lives of the writers on the 2020 shortlist.</p>
						<p>Presented by</p>
					</div>
					<img src={ScotiaLogo} className="scotia-logo"></img>
				</div>
			</div>
		</div>
	);
}

export default Giller;