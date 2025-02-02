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
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import { isMobile } from "react-device-detect";

import * as actions from "../actions";
import api from "../api/server";

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
    justifyContent: "space-between",
  },
  backdrop: {
    color: "#fff",
    background: "rgba(0, 0, 0, 0.2)",
  },
}));

const Tour = ({ closeTour, simulateHover, setTourCompleted, event, user }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

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

  const MobileConfirmation = ({ close }) => {
    const [emailAddress, setEmailAddress] = useState(user.emailAddress);

    const handleChangeEmailAddress = (event) => {
      setEmailAddress(event.target.value);
    };

    const sendReminderEmail = async () => {
      const res = await api.post("/api/event/reminder", {
        emailAddress,
        event,
      });
      close();
    };
    return (
      <div
        className={classes.content}
        style={{ width: "100%", marginTop: "20%" }}
      >
        <DialogContentText style={{ width: "100%" }}>
          Your event has been successfully created! Now it’s time to edit the
          look of your site to match your brand. This will be a lot easier if
          you are on a desktop computer. Click the button below to email
          yourself a link to continue on desktop.
        </DialogContentText>
        <FormControl
          variant="outlined"
          className={classes.formControl}
          style={{ width: "100%", margin: "10px" }}
        >
          <TextField
            label="Email Address"
            variant="outlined"
            value={emailAddress}
            onChange={handleChangeEmailAddress}
          />
        </FormControl>

        <div className={classes.buttonContainer}>
          <Button
            onClick={sendReminderEmail}
            color="primary"
            disableFocusRipple
            style={{ margin: "auto", width: "150px" }}
          >
            Send Link
          </Button>
        </div>
      </div>
    );
  };

  const getStepWithReg = (step) => {
    switch (step) {
      case 0:
        return (
          <div className={classes.content} style={{ marginTop: "30vh" }}>
            <DialogContentText style={{ width: "100%" }}>
              Congratulations your event website is ready.
              <br />
              <br />
              Your registration page can be viewed at {event.link}
              .eventscape.io, and your livestream event page will be accessible
              to only those who registered through a unique link.
              <br />
              <br />
              We will guide you through the basics of customizing your event
              website to your needs. Let's get started!
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={handleNext}
                color="primary"
                disableFocusRipple
                style={{ margin: "auto", width: "150px" }}
              >
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
                  onClick={closeTour}
                  className="skip-tour-button disable-focus"
                >
                  Skip Tour
                </Button>
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
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            className="tour-box arrow-top"
            style={{ position: "absolute", top: 190, left: "-20px" }}
          >
            <DialogContentText style={{ width: "100%" }}>
              Edit the background image, color, and image blur by clicking on
              Edit Page Background
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            className="tour-box arrow-left"
            style={{ position: "absolute", top: 122, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              You may switch to editting the registration page by clicking on
              Design and selecting the Registration Page
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            style={{ position: "absolute", top: 260, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              When a user registers for an event, they'll be automatically sent
              a registration email. You may edit this email, as well as event
              reminder emails here.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            style={{ position: "absolute", top: 350, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              You may view all your registrations on the Registrations tab as
              well as manually add your own registrations.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            style={{ position: "absolute", top: 400, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Polls tab contains everything you need to launch polls during
              your event.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                className="tour-button disable-focus"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 8:
        return (
          <div
            className="tour-box arrow-left"
            style={{ position: "absolute", top: 450, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Analytics tab shows you data on your event viewers.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                className="tour-button disable-focus"
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 9:
        return (
          <div
            className="tour-box arrow-left"
            style={{ position: "absolute", top: 500, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Messaging tab is where you interact with your attendees
              through the chat window as well as view your attendee questions.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
          <div className="tour-box" style={{ margin: "30vh auto" }}>
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
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
              <Button
                onClick={completeTour}
                className="tour-button disable-focus"
              >
                Exit
              </Button>
            </div>
          </div>
        );
    }
  };

  const getStepWithoutReg = (step) => {
    switch (step) {
      case 0:
        return (
          <div className={classes.content} style={{ marginTop: "30vh" }}>
            <DialogContentText style={{ width: "100%" }}>
              Congratulations your event website is ready.
              <br />
              <br /> We will guide you through the basics of customizing your
              event website to your needs. Let's get started!
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
                  onClick={closeTour}
                  className="skip-tour-button disable-focus"
                >
                  Skip Tour
                </Button>
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
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            className="tour-box arrow-top"
            style={{ position: "absolute", top: 190, left: "-20px" }}
          >
            <DialogContentText style={{ width: "100%" }}>
              Edit the background image, color, and image blur by clicking on
              Edit Page Background
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            className="tour-box arrow-left"
            style={{ position: "absolute", top: 220, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Polls tab contains everything you need to launch polls during
              your event.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            style={{ position: "absolute", top: 265, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Analytics tab shows you data on your event viewers.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
            style={{ position: "absolute", top: 315, left: 215 }}
          >
            <DialogContentText style={{ width: "100%" }}>
              The Messaging tab is where you interact with your attendees
              through the chat window as well as view your attendee questions.
            </DialogContentText>
            <div className={classes.buttonContainer}>
              <Button
                onClick={completeTour}
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
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
          <div className="tour-box" style={{ margin: "30vh auto" }}>
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
                className="skip-tour-button disable-focus"
              >
                Skip Tour
              </Button>
              <Button
                onClick={completeTour}
                className="tour-button disable-focus"
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
        onClose={handleNext}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          //classes: activeStep === 0 ? null : { root: classes.backdrop },
          invisible: activeStep != 0,
        }}
        disableAutoFocus={true}
      >
        <Fade in={true}>
          {isMobile ? (
            <MobileConfirmation close={closeTour} />
          ) : event.registrationRequired ? (
            getStepWithReg(activeStep)
          ) : (
            getStepWithoutReg(activeStep)
          )}
        </Fade>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    event: state.event,
    user: state.user,
  };
};

export default connect(mapStateToProps, actions)(Tour);
