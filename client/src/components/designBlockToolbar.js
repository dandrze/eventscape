import React, { useEffect } from "react";
import { connect } from "react-redux";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import SettingsIcon from "@material-ui/icons/Settings";
import "./designBlockToolbar.css";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import * as actions from "../actions";
import ArrowSketchIcon from "../icons/left-arrow-sketch.svg";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "600px",
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		outline: "none",
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: "0px",
	},
	formControl: {
		margin: "20px 0px",
		minWidth: "100%",
	},
}));

function DesignBlockToolbar(props) {
	const classes = useStyles();
	const showStreamSettings = props.section.is_stream;
	const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
	const [openStreamSettings, setOpenStreamSettings] = React.useState(false);
	const [content, setContent] = React.useState("youtube-embed");
	const [youtubeLink, setYoutubeLink] = React.useState("");
	const [customHTML, setCustomHTML] = React.useState("");

	// Updating the settings based on props
	// UseEffect mimicks OnComponentDidMount
	useEffect(() => {
		if (props.section.react_component) {
			setContent(props.section.react_component.props.content);
			setYoutubeLink(props.section.react_component.props.link);
			setCustomHTML(props.section.react_component.props.html);
		}
	}, []);

	const handleClickDelete = () => {
		setDeleteConfirmOpen(true);
	};

	const handleCloseDelete = () => {
		setDeleteConfirmOpen(false);
	};

	const handleConfirmDelete = () => {
		props.deleteSection(props.sectionIndex);
	};

	// Stream Settings:
	const handleOpenStreamSettings = () => {
		setOpenStreamSettings(true);
	};

	const handleCloseStreamSettings = () => {
		setOpenStreamSettings(false);
	};

	const handleSaveStreamSettings = () => {
		setOpenStreamSettings(false);
		console.log(content);
		props.saveStreamSettings(props.sectionIndex, {
			content,
			link: youtubeLink,
			html: customHTML,
		});
	};

	const handleChangeContent = (event) => {
		setContent(event.target.value);
	};

	const handleChangeYoutubeLink = (event) => {
		setYoutubeLink(event.target.value);
	};

	const handleChangeCustomHTML = (event) => {
		setCustomHTML(event.target.value);
	};

	const handleClickMove = (offset) => {
		if (
			props.sectionIndex + offset >= 0 &&
			props.sectionIndex + offset <= props.maxIndex - 1
		) {
			props.moveSection(props.sectionIndex, offset);
		}
	};

	return (
		<div>
			{/* Toolbar */}
			{(
				props.displayToolbar === true & 
				openStreamSettings === false & 
				deleteConfirmOpen === false
			) ? (
				<div className="toolbar_container">
					<Tooltip title="Move Up">
						<div className="toolbar_button" onClick={() => handleClickMove(-1)}>
							<KeyboardArrowUpIcon />
						</div>
					</Tooltip>
					<Tooltip title="Move Down">
						<div className="toolbar_button" onClick={() => handleClickMove(1)}>
							<KeyboardArrowDownIcon />
						</div>
					</Tooltip>
					<Tooltip title="Delete Design Block">
						<div className="toolbar_button" onClick={handleClickDelete}>
							<DeleteOutlined />
						</div>
					</Tooltip>
					{showStreamSettings ? (
						<>
							<Tooltip title="Stream Settings">
								<div className="toolbar_button" onClick={handleOpenStreamSettings}>
									<SettingsIcon />
								</div>
							</Tooltip>
							<div className="stream-setting-tip-container">
								<div className="stream-settings-tip">
									<img
										className="arrow-sketch"
										src={ArrowSketchIcon}
										alt="left arrow"
										height="30px"
									></img>
									<div className="stream-settings-tip-text">Click here to add your stream</div>
								</div>
							</div>
						</>
					) : null}
				</div>
			) : null}

			{/* Confirm Delete */}
			<Dialog
				open={deleteConfirmOpen}
				onClose={handleCloseDelete}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Delete design block?"}
				</DialogTitle>
				<DialogActions>
					<Button onClick={handleCloseDelete} color="primary">
						Cancel
					</Button>
					<Button
						onClick={() => {
							handleCloseDelete();
							handleConfirmDelete();
						}}
						color="primary"
						autoFocus
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/*Stream Settings Modal: */}
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={openStreamSettings}
				onClose={handleCloseStreamSettings}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<div className={classes.paper}>
					<div id="testEmailModal">
						<h3>Stream Settings</h3>
						<div className={classes.root}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<FormControl
										variant="outlined"
										className={classes.formControl}
									>
										{/* Category */}
										<InputLabel id="content">Content</InputLabel>
										<Select
											labelId="content"
											id="content-select"
											required="true"
											value={content}
											onChange={handleChangeContent}
										>
											<MenuItem value={"youtube-live"}>Youtube Live</MenuItem>
											<MenuItem value={"custom-embed"}>
												Custom HTML Embed (Advanced)
											</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									{content === "youtube-live" && (
										<div>
											<FormControl
												variant="outlined"
												className={classes.formControl}
											>
												<TextField
													id="youtube-link"
													label="Youtube Link"
													variant="outlined"
													value={youtubeLink}
													onChange={handleChangeYoutubeLink}
													placeholder="http://www.youtube.com"
												/>
											</FormControl>
											<p>
												Need help? Click here for instructions on setting up a
												YouTube Live stream.
											</p>
											<p>
												Heads up! YouTube may take down any streams containing
												copyrighted music.
											</p>
										</div>
									)}
									{content === "custom-embed" && (
										<FormControl
											variant="outlined"
											className={classes.formControl}
										>
											<TextField
												id="custom-HTML"
												label="Custom HTML"
												variant="outlined"
												multiline
												rows={12}
												value={customHTML}
												onChange={handleChangeCustomHTML}
											/>
										</FormControl>
									)}
								</Grid>
								<Grid item xs={12} id="save-button">
									<button
										className="Button1"
										onClick={handleSaveStreamSettings}
									>
										Save
									</button>
								</Grid>
							</Grid>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default connect(null, actions)(DesignBlockToolbar);
