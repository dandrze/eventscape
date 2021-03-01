import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";

import Divider from "@material-ui/core/Divider";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import Select from "@material-ui/core/Select";
import { HorizontalBar } from "react-chartjs-2";
import io from "socket.io-client";

import AlertModal from "./AlertModal";
import * as actions from "../actions";
import api from "../api/server";
import PollBlock from "./PollBlock";

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

const PollController = ({ polls, event }) => {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [openRepeatAlert, setOpenRepeatAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

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

    return Boolean(res.data);
  };

  const clearResultsAndContinue = async () => {
    try {
      const res = await api.delete("/api/polling/results", {
        params: { pollId: selectedPoll.id },
      });

      // push the poll to guests
      socket.emit("pushPoll", {
        eventId: event.id,
        question: selectedPoll.question,
        options: selectedPoll.PollOptions,
      });

      // Go to next step (poll progress screen)
      setStep(step + 1);
    } catch (err) {
      toast.error("Error when clearing previous results: " + err.toString());
    }
  };

  const goToNextStep = async () => {
    // do checks to confirm if we can move to the next step
    switch (step) {
      case 0:
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
        });
        break;

      case 1:
        // Push an event to end the poll
        socket.emit("closePoll", event.id);
        return;
        break;
    }
    setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        // First page is the poll selection
        return (
          <SelectPoll
            polls={polls}
            selectedPoll={selectedPoll}
            handleChangeSelectedPoll={handleChangeSelectedPoll}
          />
        );
      case 1:
        return <PollInProgress poll={selectedPoll} eventId={event.id} />;
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

      <Divider className={classes.divider} variant="middle" />

      <FormControl variant="outlined" className={classes.formControl}>
        <Button
          variant="contained"
          color="primary"
          onClick={goToNextStep}
          class="Button1"
          style={{ width: "150px", alignSelf: "flex-end" }}
        >
          {step === 0 ? "Launch Poll" : step === 1 ? "End Poll" : "Close"}
        </Button>
      </FormControl>
    </div>
  );
};

const SelectPoll = ({ polls, selectedPoll, handleChangeSelectedPoll }) => {
  const classes = useStyles();

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="select-poll-label">Select Poll</InputLabel>
        <Select
          labelId="select-poll-label"
          value={selectedPoll}
          onChange={handleChangeSelectedPoll}
          label="Select Poll"
        >
          {polls.map((poll) => {
            return <MenuItem value={poll}>{poll.question}</MenuItem>;
          })}
        </Select>
      </FormControl>
      {selectedPoll ? (
        <>
          <Divider className={classes.divider} variant="middle" />
          <PollBlock
            question={selectedPoll.question}
            pollOptions={selectedPoll.PollOptions}
            readOnly={true}
          />
        </>
      ) : null}
    </>
  );
};

const PollInProgress = ({ poll, eventId }) => {
  const [results, setResults] = useState([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);

  useEffect(() => {
    // fetch the response results
    fetchResults();

    // fetch the results after 3 seconds and every 3 seconds

    const interval = setInterval(() => {
      fetchResults();
    }, 3000);

    // clear the interval upon unmount
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    const resultsRes = await api.get("/api/polling/results", {
      params: { pollId: poll.id },
    });

    const responseData = resultsRes.data;

    // the mapping function below adds a response key with the response count pulled from the responseData object using
    // the PollOption id as the key
    const pollOptionsWithResponses = poll.PollOptions.map((pollOption) => {
      return { ...pollOption, responses: responseData[pollOption.id] };
    });
    // set results to the new poll option with responses added to it
    setResults(pollOptionsWithResponses);

    // set the total number of responses
    var count = 0;
    for (let result of pollOptionsWithResponses) {
      count += result.responses;
    }
    setTotalResponses(count);

    // get the total number of visitors

    const currentVisitorsRes = await api.get("api/analytics/current-visitors", {
      params: { eventId },
    });
    setTotalVisitors(currentVisitorsRes.data.currentVisitors);
  };
  const labels = results.map((option) => {
    return option.text;
  });
  const pollData = results.map((option) => {
    return option.responses;
  });

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: pollData,
      },
    ],
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <RadioButtonCheckedIcon style={{ margin: "12px", color: "#b0281c" }} />
        <h2>Poll in Progress</h2>
        <h2 style={{ marginLeft: "auto" }}>0:00</h2>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          padding: "12px",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          marginBottom: "2rem",
        }}
      >
        <label style={{ marginBottom: "0px" }}>
          Attendees are now viewing question
        </label>
        <label style={{ marginLeft: "auto", marginBottom: "0px" }}>
          {totalResponses} of {totalVisitors} (
          {totalResponses && totalVisitors
            ? Math.round((totalResponses / totalVisitors) * 100) + "%"
            : "Error"}
          ) voted
        </label>
      </div>
      {/* Previews the selected poll question*/}
      <h5>{poll.question}</h5>
      <div style={{ width: "100%", height: "250px" }}>
        <HorizontalBar
          data={data}
          // width={100}
          //height={"20px"}
          options={{
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
          }}
        />
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return { polls: state.polls, event: state.event };
};

export default connect(mapStateToProps, actions)(PollController);
