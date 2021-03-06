import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

import Divider from "@material-ui/core/Divider";
import io from "socket.io-client";

import AlertModal from "../AlertModal";
import * as actions from "../../actions";
import api from "../../api/server";
import PollSelect from "./PollSelect";
import PollInProgress from "./PollInProgress";
import PollShare from "./PollShare";

const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/" : "/";

let socket;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  addOption: {
    cursor: "pointer",
    color: "#b0281c",
  },
  removeOption: { margin: "10px", cursor: "pointer", color: "#b0281c" },
  divider: { marginTop: "10px", marginBottom: "30px" },
}));

const PollController = ({
  polling: { selectedPollIndex, polls, results, totalResponded },
  event,
  updatePreventCloseText,
  closeWindow,
}) => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [openRepeatAlert, setOpenRepeatAlert] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT, {
      path: "/api/socket/event",
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.io.on("reconnect", () => {
      console.log("reconnected!");
      console.log(socket);

      socket.emit("rejoin", { eventId: event.id });
    });

    socket.on("poll", () => {
      console.log("Poll received");
      // Poll successfully received by all end points
    });

    socket.emit("join", {
      EventId: event.id,
      isModerator: true,
    });
  }, []);

  const pollLaunchedBefore = async () => {
    // if there are results, that means the poll has already been launched before
    const res = await api.get("/api/polling/results", {
      params: { pollId: polls[selectedPollIndex].id },
    });

    // return true if there are any responses. If there are no response, 0 returns false
    return Boolean(res.data.totalResponded);
  };

  const clearResultsAndContinue = async () => {
    try {
      const res = await api.delete("/api/polling/results", {
        params: { pollId: polls[selectedPollIndex].id },
      });

      completePollLaunch();
    } catch (err) {
      toast.error("Error when clearing previous results: " + err.toString());
    }
  };

  const completePollLaunch = async () => {
    // push the poll to guests
    socket.emit("pushPoll", {
      eventId: event.id,
      question: polls[selectedPollIndex].question,
      options: polls[selectedPollIndex].PollOptions,
      allowMultiple: polls[selectedPollIndex].allowMultiple,
    });
    try {
      const res = await api.put("/api/polling/poll", {
        pollId: polls[selectedPollIndex].id,
      });
    } catch (err) {
      toast.error("Error when launching poll " + err.toString());
    }

    setStep(1);
  };

  const launchPoll = async () => {
    if (await pollLaunchedBefore()) {
      // if the poll has been lauched before, open an alert alerting the user that they will need to clear the results of the previous poll to continue
      setOpenRepeatAlert(true);
      // exit the function
      return;
    }

    completePollLaunch();
  };

  const endPoll = async () => {
    // Push an event to end the poll
    socket.emit("closePoll", event.id);

    setStep(2);
  };

  const shareResults = async () => {
    socket.emit("sharePollResults", {
      eventId: event.id,
      poll: polls[selectedPollIndex],
      results,
      totalResponded,
    });
    setStep(3);
  };

  const stopSharingResults = () => {
    socket.emit("stopSharingPollResults", event.id);
    setStep(2);
  };

  const handlePollChanged = () => {
    if (step === 2) setStep(0);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        // Allow the modal to close on this step
        updatePreventCloseText("");

        // First page is the poll selection
        return (
          <>
            <PollSelect pollChanged={handlePollChanged} />

            <FormControl variant="outlined" className={classes.formControl}>
              <Button
                variant="contained"
                color="primary"
                onClick={launchPoll}
                class="Button1"
                style={{ width: "150px", alignSelf: "flex-end" }}
              >
                Launch Poll
              </Button>
            </FormControl>
          </>
        );
      case 1:
        // Prevent the modal from closing during live poll
        updatePreventCloseText(
          "There is a live poll in progress. Please end the poll before exiting."
        );

        // second step is the live poll
        return (
          <>
            <PollInProgress />
            <Divider className={classes.divider} variant="middle" />

            <FormControl variant="outlined" className={classes.formControl}>
              <Button
                variant="contained"
                color="primary"
                onClick={endPoll}
                class="Button1"
                style={{ width: "150px", alignSelf: "flex-end" }}
              >
                End Poll
              </Button>
            </FormControl>
          </>
        );
      case 2:
        //Allow the modal to close during this step

        updatePreventCloseText("");

        // third step is the complete poll screen
        return (
          <>
            <PollSelect pollChanged={handlePollChanged} />
            <FormControl
              variant="outlined"
              className={classes.formControl}
              style={{ flexDirection: "row", justifyContent: "flex-end" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={launchPoll}
                class="Button1"
                style={{ minWidth: "150px", marginLeft: "12px" }}
              >
                Relaunch poll
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={shareResults}
                class="Button1"
                style={{ minWidth: "150px", marginLeft: "12px" }}
              >
                Share Results
              </Button>
            </FormControl>
          </>
        );

      case 3:
        // Prevent the modal from closing during sharing results

        updatePreventCloseText(
          "You are currently sharing results with users. Please stop sharing the results before exiting."
        );

        // third step is the sharing screen
        return (
          <>
            <PollShare poll={polls[selectedPollIndex]} />
            <Divider className={classes.divider} variant="middle" />

            <FormControl variant="outlined" className={classes.formControl}>
              <Button
                variant="contained"
                color="primary"
                onClick={stopSharingResults}
                class="Button1"
                style={{ minWidth: "150px", alignSelf: "flex-end" }}
              >
                Stop Sharing Results
              </Button>
            </FormControl>
          </>
        );
    }
  };

  return (
    <div style={{ width: "650px" }}>
      <AlertModal
        open={openRepeatAlert}
        onClose={() => setOpenRepeatAlert(false)}
        onContinue={() => {
          clearResultsAndContinue();
          setOpenRepeatAlert(false);
        }}
        content={
          "This poll has been launched before. To launch it again, you will need to clear the previous results"
        }
        closeText="Go Back"
        continueText="Clear Results + Continue"
      />
      <div>{renderStep()}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { polling: state.polling, event: state.event };
};

export default connect(mapStateToProps, actions)(PollController);
