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
import PollComplete from "./PollComplete";
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

const PollController = ({ polls, event, handleClose }) => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [openRepeatAlert, setOpenRepeatAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [results, setResults] = useState([]);

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
    console.log(socket);

    socket.on("poll", () => {
      console.log("Poll received");
      // Poll successfully received by all end points
    });

    socket.emit("join", {
      EventId: event.id,
      isModerator: true,
    });
  }, []);

  const handleChangeSelectedPoll = (event) => {
    setSelectedPoll(event.target.value);
    console.log(selectedPoll);
  };

  const pollLaunchedBefore = async () => {
    // if there are results, that means the poll has already been launched before
    const res = await api.get("/api/polling/results", {
      params: { pollId: selectedPoll.id },
    });

    return Boolean(res.data.results);
  };

  const clearResultsAndContinue = async () => {
    try {
      const res = await api.delete("/api/polling/results", {
        params: { pollId: selectedPoll.id },
      });

      console.log(selectedPoll);

      // push the poll to guests
      socket.emit("pushPoll", {
        eventId: event.id,
        question: selectedPoll.question,
        options: selectedPoll.PollOptions,
        allowMultiple: selectedPoll.allowMultiple,
      });

      // Go to next step (poll progress screen)
      setStep(step + 1);
    } catch (err) {
      toast.error("Error when clearing previous results: " + err.toString());
    }
  };

  const launchPoll = async () => {
    if (!selectedPoll) {
      setAlertText("Please select a poll to launch");
      setOpenAlert(true);
      return;
    }
    if (await pollLaunchedBefore()) {
      // if the poll has been lauched before, open an alert alerting the user that they will need to clear the results of the previous poll to continue
      setOpenRepeatAlert(true);
      // exit the function
      return;
    }

    // push the poll to guests
    socket.emit("pushPoll", {
      eventId: event.id,
      question: selectedPoll.question,
      options: selectedPoll.PollOptions,
      allowMultiple: selectedPoll.allowMultiple,
    });

    setStep(step + 1);
  };

  const endPoll = async () => {
    // Push an event to end the poll
    socket.emit("closePoll", event.id);

    setStep(step + 1);
  };

  const shareResults = async () => {
    socket.emit("sharePollResults", {
      eventId: event.id,
      poll: selectedPoll,
      results,
    });
    setStep(step + 1);
  };

  const stopSharingResults = () => {
    socket.emit("stopSharingPollResults", event.id);
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        // First page is the poll selection
        return (
          <>
            <PollSelect
              polls={polls}
              selectedPoll={selectedPoll}
              handleChangeSelectedPoll={handleChangeSelectedPoll}
            />
            <Divider className={classes.divider} variant="middle" />

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
        return (
          <>
            <PollInProgress
              poll={selectedPoll}
              eventId={event.id}
              results={results}
              setResults={setResults}
            />
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
        return (
          <>
            <PollComplete results={results} poll={selectedPoll} />
            <Divider className={classes.divider} variant="middle" />
            <FormControl
              variant="outlined"
              className={classes.formControl}
              style={{ flexDirection: "row", justifyContent: "flex-end" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setStep(0)}
                class="Button1"
                style={{ minWidth: "150px", marginLeft: "12px" }}
              >
                Launch another poll
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
                class="Button1"
                style={{ minWidth: "150px", marginLeft: "12px" }}
              >
                Close
              </Button>
            </FormControl>
          </>
        );

      case 3:
        return (
          <>
            <PollShare results={results} poll={selectedPoll} />
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
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        content={alertText}
        closeText="OK"
      />
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
  return { polls: state.polls, event: state.event };
};

export default connect(mapStateToProps, actions)(PollController);
