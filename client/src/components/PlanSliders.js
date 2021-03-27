import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import AlertModal from "./AlertModal";

import api from "../api/server";

export default ({ onClose, event, currentPlan }) => {
  const [viewers, setViewers] = React.useState(currentPlan.viewers || 0);

  const [streamingTime, setStreamingTime] = React.useState(
    currentPlan.streamingTime || 0
  );

  console.log(currentPlan);

  const marksViewers = [
    {
      value: 500,
      //label: '500',
    },
    {
      value: 1000,
      //label: '1000',
    },
    {
      value: 1500,
      //label: '1500',
    },
    {
      value: 2000,
      //label: '2000',
    },
    {
      value: 3000,
      //label: '3000',
    },
    {
      value: 4000,
      //label: '4000',
    },
    {
      value: 5000,
      //label: '5000',
    },
    {
      value: 5500,
      //label: '5000',
    },
  ];

  function valuetextViewers(value) {
    return `${value} Viewers`;
  }

  function valueLabelFormatViewers(value) {
    if (value <= 5000) {
      return value;
    } else {
      return "5k+";
    }
  }

  const marksTime = [
    {
      value: 1,
      //label: '1 h',
    },
    {
      value: 2,
      //label: '2 h',
    },
    {
      value: 3,
      //label: '3 h',
    },
    {
      value: 4,
      //label: '4 h',
    },
    {
      value: 6,
      //label: '6 h',
    },
    {
      value: 8,
      //label: '8 h',
    },
    {
      value: 9,
      //label: '8+ h',
    },
  ];

  function valuetextTime(value) {
    return value;
  }

  function valueLabelFormatTime(value) {
    if (value <= 8) {
      return value + " h";
    } else {
      return "8+ h";
    }
  }
  const [essentialsAlertOpen, setEssentialsAlertOpen] = React.useState(false);

  const handleChangeViewers = (event, newValue) => {
    setViewers(newValue);
  };

  const handleChangeStreamingTime = (event, newValue) => {
    setStreamingTime(newValue);
  };

  const handleUpdatePlan = async () => {
    const res = await api.put("/api/invoice/plan", {
      planId: currentPlan.id,
      viewers,
      streamingTime,
    });
    onClose();
    // insert save to db here
  };

  const openEssentialsAlert = () => {
    setEssentialsAlertOpen(true);
  };

  const closeEssentialsAlert = () => {
    setEssentialsAlertOpen(false);
  };

  const handleCancelPro = () => {
    setEssentialsAlertOpen(false);
    onClose();
    // insert change db back to Essentials at $0
  };

  //Price Calculation:
  const fixedPrice = 250; // Fixed price per event. Covers support time and other costs.
  const variablePrice = 0.1; // Variable price per viewer per hour. Covers CDN streaming costs and other variable costs.
  const Price = fixedPrice + viewers * streamingTime * variablePrice; // Price formula
  const contactUs = viewers > 5000 || streamingTime > 8; // Contact us for events with over 5000 viewers or 8 hours of streaming time.

  return (
    <>
      <AlertModal
        open={essentialsAlertOpen}
        onClose={handleCancelPro}
        onContinue={closeEssentialsAlert}
        text="If you cancel your Pro plan, you will lose access to advanced features such as the ability to control branding, custom registration fields, advanced analytics, and more. Are you sure you want to cancel? "
        closeText="Cancel Pro Plan"
        continueText="Go Back"
      />
      <div style={{ width: "300px" }}>
        <Typography id="unique-viewers-slider" align="center" gutterBottom>
          Maximum Viewers
        </Typography>
        <br></br>
        <br></br>
        <Slider
          value={viewers}
          onChange={handleChangeViewers}
          valueLabelFormat={valueLabelFormatViewers} // previously valueLabelFormatViewers
          getAriaValueText={valuetextViewers}
          aria-labelledby="unique-viewers-slider"
          min={0}
          max={5500}
          step={null}
          valueLabelDisplay="on"
          marks={marksViewers}
        />
        <br></br>
        <br></br>

        <Typography id="streaming-time-slider" align="center" gutterBottom>
          Streaming Time
        </Typography>
        <br></br>
        <br></br>
        <Slider
          value={streamingTime}
          onChange={handleChangeStreamingTime}
          valueLabelFormat={valueLabelFormatTime}
          getAriaValueText={valuetextTime}
          aria-labelledby="streaming-time-slider"
          min={0}
          max={9}
          step={null}
          valueLabelDisplay="on"
          marks={marksTime}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <br></br>
        <p>
          {valueLabelFormatViewers(viewers) +
            " viewers for " +
            valueLabelFormatTime(streamingTime) +
            "our(s)"}
        </p>
        {contactUs === false && (
          <>
            <p>{"$" + Price + " USD"}</p>
            <span style={{ color: "grey" }}>
              *additional viewers or time will be billed <br></br>at $.01 per
              viewer per minute.
            </span>
            <br></br>
            <br></br>
            <button className="Button1" onClick={handleUpdatePlan}>
              Update Plan
            </button>
          </>
        )}
        {contactUs === true && (
          <>
            <p>Contact us for a price!</p>
            <br></br>
            <br></br>
            <br></br>
            <button className="Button1">Contact Us</button>
          </>
        )}
        <br></br>
        <br></br>
        <div className="link1" onClick={openEssentialsAlert}>
          Cancel Pro Plan
        </div>
      </div>
    </>
  );
};
