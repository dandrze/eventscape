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

/* Design Block Thumbnails: */
import logoHeader from "./designBlockThumbnails/logoHeader.png";
import heroBanner from "./designBlockThumbnails/heroBanner.png";
import descriptionRegistration from "./designBlockThumbnails/descriptionRegistration.png";
import titleThumb from "./designBlockThumbnails/title.png";
import streamChatThumb from "./designBlockThumbnails/streamChat.png";
import blankThumb from "./designBlockThumbnails/blank.png";
import registrationHeaderThumb from "./designBlockThumbnails/registrationHeader.png";
import {
  logoHeaderModel,
  heroBannerModel,
  descriptionRegistrationModel,
  titleTimeModel,
  streamChatModel,
  blankModel,
  streamChatReact,
  registrationFormHeader,
  registrationFormReact,
} from "./designBlockModels";

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
}));

const NewSectionButton = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selection, setSelection] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (
    html,
    is_react = false,
    react_component = null,
    is_stream = false
  ) => {
    setOpen(false);
    props.addSection(
      props.prevIndex,
      html,
      is_react,
      react_component,
      is_stream
    );
    /*insert actions here*/
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
            <div id="testEmailModal">
              <h3>Choose a Design Block Template</h3>
              <div className={classes.root}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <img
                      src={logoHeader}
                      id="designBlockThumbnail"
                      onClick={() => handleSelect(logoHeaderModel())}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <img
                      src={heroBanner}
                      id="designBlockThumbnail"
                      onClick={() =>
                        handleSelect(heroBannerModel(props.event.title))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <img
                      src={descriptionRegistration}
                      id="designBlockThumbnail"
                      onClick={() =>
                        handleSelect(
                          descriptionRegistrationModel(
                            props.event.start_date,
                            props.event.end_date
                          )
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <img
                      src={titleThumb}
                      id="designBlockThumbnail"
                      onClick={() =>
                        handleSelect(
                          titleTimeModel(
                            props.event.title,
                            props.event.start_date,
                            props.event.end_date
                          )
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <img
                      src={streamChatThumb}
                      id="designBlockThumbnail"
                      onClick={() =>
                        handleSelect(null, true, streamChatReact, true)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <img
                      src={blankThumb}
                      id="designBlockThumbnail"
                      onClick={() => handleSelect("")}
                    />
                  </Grid>
                  <Grid item xs={13}>
                    <img
                      src={registrationHeaderThumb}
                      id="designBlockThumbnail"
                      onClick={() => handleSelect(registrationFormHeader())}
                    />
                  </Grid>
                  <Grid item xs={14}>
                    <img
                      src={registrationHeaderThumb}
                      id="designBlockThumbnail"
                      onClick={() =>
                        handleSelect(null, true, registrationFormReact, false)
                      }
                    />
                  </Grid>
                </Grid>
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
