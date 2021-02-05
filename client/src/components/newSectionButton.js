import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import PlusDropIcon from "../icons/plus-drop.svg";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "./newSectionButton.css";
import Cancel from "../icons/cancel.svg";

/* Design Block Thumbnails: */
import logoHeader from "./designBlockThumbnails/logoHeader.png";
import heroBanner from "./designBlockThumbnails/heroBanner.png";
import titleThumb from "./designBlockThumbnails/title.png";
import streamChatThumb from "./designBlockThumbnails/streamChat.png";
import blankThumb from "./designBlockThumbnails/blank.png";
import timeDescriptionThumb from "./designBlockThumbnails/timeDescription.png";
import registrationHeaderThumb from "./designBlockThumbnails/registrationHeader.png";
import {
  logoHeaderModel,
  heroBannerModel,
  descriptionRegistrationModel,
  titleTimeModel,
  streamChatModel,
  blankModel,
  streamChatReact,
  timeDescription,
  registrationFormReact,
  registrationFormDescription,
} from "../templates/designBlockModels";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "400px",
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
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const NewSectionButton = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selection, setSelection] = React.useState("");
  const [blockCat, setBlockCat] = React.useState("logo-header");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddSection = async (
    html,
    isReact = false,
    reactComponent = null
  ) => {
    props.addSection(props.prevIndex, html, isReact, reactComponent);
  };

  const handleChangeBlockCat = (event) => {
    setBlockCat(event.target.value);
  };

  return (
    <div>
      <button
        className="addSection"
        onClick={() => {
          handleOpen();
        }}
      >
        <Tooltip title="Add Design Block">
          <img src={PlusDropIcon} id="plusDropIcon" height="40px"></img>
        </Tooltip>
      </button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className="cancel-bar">
              <Tooltip title="Close">
                <img
                  src={Cancel}
                  className="cancel-bar-icon"
                  onClick={handleClose}
                ></img>
              </Tooltip>
            </div>
            <div className="block-picker-container">
              <h3>Choose a Design Block Template</h3>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                style={{ marginBottom: "40px", marginTop: "30px" }}
              >
                {/* Category */}
                <InputLabel id="block-cat" className="mui-select-css-fix">
                  Category
                </InputLabel>
                <Select
                  labelId="block-cat"
                  id="block-cat-select"
                  required="true"
                  value={blockCat}
                  onChange={handleChangeBlockCat}
                >
                  <MenuItem value={"logo-header"}>Logo Header</MenuItem>
                  <MenuItem value={"title"}>Title</MenuItem>
                  <MenuItem value={"registration"}>Registration</MenuItem>
                  <MenuItem value={"stream-messaging"}>
                    Stream/Messaging
                  </MenuItem>
                  <MenuItem value={"columns-blank"}>Columns (Blank)</MenuItem>
                </Select>
              </FormControl>

              <div className={classes.root}>
                {blockCat === "logo-header" && (
                  <Grid container spacing={3}>
                    {/* Logo Header */}
                    <Grid item xs={12}>
                      <img
                        src={logoHeader}
                        id="designBlockThumbnail"
                        onClick={() => {
                          handleClose();
                          handleAddSection(logoHeaderModel());
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                {blockCat === "title" && (
                  <Grid container spacing={3}>
                    {/* Registration Page Title */}
                    <Grid item xs={12}>
                      <img
                        src={heroBanner}
                        id="designBlockThumbnail"
                        onClick={() => {
                          handleClose();
                          handleAddSection(heroBannerModel(props.event.title));
                        }}
                      />
                    </Grid>

                    {/* Event page title */}
                    <Grid item xs={12}>
                      <img
                        src={titleThumb}
                        id="designBlockThumbnail"
                        onClick={() => {
                          handleClose();
                          handleAddSection(
                            titleTimeModel(
                              props.event.title,
                              props.event.startDate,
                              props.event.endDate
                            )
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                {blockCat === "registration" && (
                  <Grid container spacing={3}>
                    {/* Description Registration */}
                    <Grid item xs={12}>
                      <img
                        src={registrationHeaderThumb}
                        id="designBlockThumbnail"
                        onClick={async () => {
                          handleClose();
                          await handleAddSection(
                            registrationFormDescription(
                              props.event.startDate,
                              props.event.endDate,
                              props.event.timeZone
                            ),
                            true,
                            registrationFormReact
                          );
                        }}
                      />
                    </Grid>

                    {/* Time Description */}
                    <Grid item xs={12}>
                      <img
                        src={timeDescriptionThumb}
                        id="designBlockThumbnail"
                        onClick={() => {
                          handleClose();
                          handleAddSection(timeDescription());
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                {blockCat === "stream-messaging" && (
                  <Grid container spacing={3}>
                    {/* Stream Chat */}
                    <Grid item xs={12}>
                      <img
                        src={streamChatThumb}
                        id="designBlockThumbnail"
                        onClick={() => {
                          handleClose();
                          handleAddSection(null, true, streamChatReact);
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                {blockCat === "columns-blank" && (
                  <Grid container spacing={3}>
                    {/* Blank */}
                    <Grid item xs={12}>
                      <img
                        src={blankThumb}
                        id="designBlockThumbnail"
                        onClick={() => {
                          handleClose();
                          handleAddSection("");
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(NewSectionButton);
