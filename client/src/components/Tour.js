import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import { shadows } from "@material-ui/system";
import Box from "@material-ui/core/Box";
import SyncAltIcon from "@material-ui/icons/SyncAlt";

import * as actions from "../actions";

const useStyles = makeStyles((theme) => ({
  content: {
    outline: "none",
    background: "#fff",
    height: "auto",
    margin: "auto",
    padding: "30px",
    border: "2px solid #c8c8c8",
    width: "500px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  backdrop: {
    color: "#fff",
    background: "rgba(0, 0, 0, 0.2)",
  },
}));

const getSteps = () => {
  return ["Upload CSV", "Verify Columns", "Confirm"];
};

const Tour = ({ closeTour, simulateHover, setTourCompleted }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  useEffect(() => {
    if (activeStep === 4) {
      simulateHover(2);
    } else {
      simulateHover(null);
    }
  }, [activeStep]);

  const handleNext = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const completeTour = () => {
    setTourCompleted();
    closeTour();
  };

  const getStepWithReg = (step) => {
    switch (step) {
      case 0:
        return (
          <div className={classes.content} style={{ marginTop: "30vh" }}>
            <DialogContentText style={{ width: "100%" }}>
              Welcome to your event website!
              <br />
              <br />
              We've got you started with two pages. One for your visitors to
              register on, and one for your livestream event.
              <br />
              <br />
              Your registration page can be viewed at link.eventscape.io, and
              your livestream event page will be accessible to only those who
              registered through a unique link.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button onClick={handleNext} color="primary" disableFocusRipple>
                Continue
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <>
            <div
              className="tour-box arrow-bottom"
              style={{ marginTop: "30px" }}
            >
              <DialogContentText style={{ width: "100%" }}>
                Here is your event page. It contains a logo header, a section
                for your livestream, and a window for your attendees to chat and
                ask questions.
              </DialogContentText>
              <div className={classes.buttonContainer}>
                <Button
                  onClick={handleNext}
                  className="tour-button disable-focus"
                  disableFocusRipple
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <div
            className="tour-box arrow-top"
            style={{ position: "absolute", top: 30, left: -10 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              See what this page looks like to your end users by going to the
              live site here
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={handleNext}
                className="tour-button disable-focus"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div
            className="tour-box arrow-bottom"
            style={{ position: "absolute", top: 80, right: 75 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              Click on any image, and then click <SyncAltIcon /> to replace it
              with your own.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={handleNext}
                className="tour-button disable-focus"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div
            className="tour-box arrow-left-bottom"
            style={{ position: "absolute", top: 225, left: 430 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              Below is your livestream window. To replace the placeholder with
              your own livestream, remove the chat option, or remove the
              questions option, hover your mouse over this section and click on
              the settings icon to the left. You will find out how to do this
              here. (link)
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={handleNext}
                className="tour-button disable-focus"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div
            className="tour-box arrow-left"
            style={{ position: "absolute", top: 315, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Polls tab contains everything you need to launch polls during
              your event.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={handleNext}
                className="tour-button disable-focus"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div
            className="tour-box arrow-left"
            style={{ position: "absolute", top: 360, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Analytics tab shows you data on your event viewers.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={handleNext}
                className="tour-button disable-focus"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 7:
        return (
          <div
            className="tour-box arrow-left"
            style={{ position: "absolute", top: 410, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Messaging tab is where you interact with your attendees
              through the chat window as well as view your attendee questions.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={handleNext}
                className="tour-button disable-focus"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className={classes.content} style={{ marginTop: "30vh" }}>
            <DialogContentText style={{ width: "100%" }}>
              You're all set!
              <br />
              <br />
              Feel free to send a message by clicking on the chat icon in the
              bottom right if you need any help!
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                color="primary"
                disableFocusRipple
                className="disable-focus"
              >
                Exit
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={true}
        onClose={closeTour}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          //classes: activeStep === 0 ? null : { root: classes.backdrop },
          invisible: activeStep != 0,
        }}
        disableAutoFocus={true}
      >
        <Fade in={true}>{getStepWithReg(activeStep)}</Fade>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    event: state.event,
  };
};

export default connect(mapStateToProps, actions)(Tour);
