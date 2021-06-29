import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import "./license.css";
import NavBar3 from "../components/navBar3.js";
import Modal1 from "../components/Modal1";
import api from "../api/server";

const License = ({ event, fetchEvent }) => {
  const [openAddLicense, setOpenAddLicense] = useState(false);
  const [includeCDN, setIncludeCDN] = useState(true);
  const [eventType, setEventType] = useState("open");

  const handleChangeIncludeCDN = (event) => {
    setIncludeCDN(event.target.checked);
  };

  const handleClickEventType = (selectedEvent) => {
    setEventType(selectedEvent);
  };

  const handleClickAddEvent = async () => {
    console.log({ includeCDN, eventType });
    const res = await api.post("/api/billing/license", {
      eventId: event.id,
      includeCDN,
      type: eventType,
    });

    window.location.reload();

    console.log(res);
  };

  const handleClickRemoveLicense = async () => {
    console.log(event.id);
    const res = await api.delete("/api/billing/license", {
      params: { eventId: event.id },
    });

    window.location.reload();
  };

  return (
    <div>
      <Modal1
        open={openAddLicense}
        onClose={() => setOpenAddLicense(false)}
        title="Add Event License"
        content={
          <div style={{ textAlign: "center", width: "800px" }}>
            <div style={{ display: "flex", paddingTop: "20px" }}>
              <div
                className={`license-box license-box-selector ${
                  eventType === "open" ? "active" : ""
                }`}
                onClick={() => handleClickEventType("open")}
              >
                <div className="license-box-label">Current Event Type</div>

                <h3>Open Event</h3>
                <p>
                  $99 USD
                  <br />
                  +<br />
                  99 &#162; / Event Viewer<sup>1</sup>
                </p>
                <hr />
                <p>Event up to 4 hours long</p>
                <p className="subtext">
                  (Events that are longer than 4 hours are billed an additional
                  25 &#162; / unique viewer per additional hour<sup>2</sup>)
                </p>
              </div>
              <div
                className={`license-box license-box-selector ${
                  eventType === "registration" ? "active" : ""
                }`}
                onClick={() => handleClickEventType("registration")}
              >
                <div className="license-box-label">Current Event Type</div>

                <h3>Registration Event</h3>
                <p>
                  $99 USD
                  <br />
                  +<br />
                  75 &#162; / Registration
                </p>
                <hr />
                <p>Event up to 4 hours long</p>
                <p className="subtext">
                  (Events that are longer than 4 hours are billed an additional
                  19 &#162; / registration per additional hour<sup>2</sup>)
                </p>
              </div>
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeCDN}
                  onChange={handleChangeIncludeCDN}
                  color="primary"
                />
              }
              label="Include Content Delivery Network"
              style={{ margin: "10px" }}
            />
            <div style={{ margin: "0px 0px 20px" }}>
              <p className="subtext">
                <sup>1</sup> An Event Viewer is someone who viewed the event
                between the start and end time for at least 20 minutes.{" "}
              </p>
              <p className="subtext">
                <sup>2</sup> Event length is start time to end time (not
                including rehearsals, etc.). For events longer than 4 hours send
                us a message using the chat in the bottom right{" "}
              </p>
              <p className="subtext">
                License can be cancelled up until 1 hour before the event
              </p>
              <p className="subtext">
                Registrations will be counted until the event end time
              </p>
              <p className="subtext">
                Add now, pay later. You will be billed after your event is
                complete.
              </p>
            </div>
            <button className="Button1" onClick={handleClickAddEvent}>
              Add Event License
            </button>
          </div>
        }
      />
      <NavBar3
        displaySideNav="true"
        highlight="license"
        content={
          <div className="mainWrapper container-width">
            {event.License ? (
              <div
                style={{
                  width: "550px",
                  background: "#fff",
                  margin: "auto",
                  padding: "40px",
                }}
              >
                <div className="license-box">
                  <h3>
                    {event.License.type === "open"
                      ? "Open Event"
                      : "Registration Event"}
                  </h3>
                  <p>
                    ${event.License.basePrice} USD
                    <br />
                    +<br />${event.License.pricePerViewer} / Registration
                  </p>
                  <hr />
                  <p style={{ marginBottom: "10px" }}>
                    {event.License.includeCDN
                      ? "Content Delivery Network included"
                      : "Bring your own Content Delivery Network"}
                  </p>
                  <p>Event up to 4 hours long</p>
                  <p className="subtext">
                    (Events that are longer than 4 hours are billed an
                    additional 19 &#162; / registration per additional hour
                    <sup>2</sup>)
                  </p>
                </div>
                <div style={{ margin: "20px 0px 20px" }}>
                  <p className="subtext">
                    <sup>1</sup> An Event Viewer is someone who viewed the event
                    between the start and end time for at least 20 minutes.{" "}
                  </p>
                  <p className="subtext">
                    <sup>2</sup> Event length is start time to end time (not
                    including rehearsals, etc.). For events longer than 4 hours
                    send us a message using the chat in the bottom right{" "}
                  </p>
                  <p className="subtext">
                    License can be cancelled up until 1 hour before the event
                  </p>
                  <p className="subtext">
                    Registrations will be counted until the event end time
                  </p>
                  <p className="subtext">
                    Add now, pay later. You will be billed after your event is
                    complete.
                  </p>
                </div>
                <div
                  style={{
                    cursor: "pointer",
                    padding: "16px 24px",
                    fontWeight: 400,
                    color: "#b0281c",
                    fontSize: "0.9rem",
                  }}
                  onClick={handleClickRemoveLicense}
                >
                  Go Back to Demo Mode
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  className="form-box shadow-border"
                  style={{ width: "550px", margin: "0px 16px" }}
                >
                  <h3 style={{ marginBottom: "30px" }}>
                    Your event is currently in demo mode
                  </h3>
                  <p style={{ fontSize: "1rem" }}>
                    You may built, test, and demo your event page in demo mode.
                    A message will appear on your event page that you are
                    currently in demo mode. Add a license below to remove the
                    demo mode message from your event page.
                  </p>

                  <p style={{ fontSize: "1rem" }}>
                    You will not be charged until after your event is complete
                  </p>
                  <button
                    className="Button1"
                    onClick={() => setOpenAddLicense(true)}
                  >
                    Add Event License
                  </button>
                </div>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, settings: state.settings };
};

export default connect(mapStateToProps, actions)(License);
