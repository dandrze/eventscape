import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import "./license.css";
import NavBar3 from "../components/navBar3.js";
import Modal1 from "../components/Modal1";
import api from "../api/server";

const License = ({ event }) => {
  const [openAddLicense, setOpenAddLicense] = useState(false);
  const [includeCDN, setIncludeCDN] = useState(true);

  const handleChangeIncludeCDN = (event) => {
    setIncludeCDN(event.target.checked);
  };

  const handleClickAddEvent = async () => {
    const res = await api.post("/api/billing/license", {
      eventId: event.id,
      includeCDN,
      pricePerViewer: includeCDN
        ? global.PRICE_PER_VIEWER
        : global.PRICE_PER_VIEWER_NO_CDN,
      pricePerRegistration: includeCDN
        ? global.PRICE_PER_REGISTRATION
        : global.PRICE_PER_REGISTRATION_NO_CDN,
      basePrice: includeCDN ? global.BASE_PRICE : global.BASE_PRICE_NO_CDN,
      includeCDN,
    });

    window.location.reload();

    console.log(res);
  };

  const handleClickRemoveLicense = async () => {
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
                className={`license-box left ${
                  !event.registrationRequired ? "active" : ""
                }`}
              >
                <div className="license-box-label">
                  Current Event Type<sup>3</sup>
                </div>

                <h3>Open Event</h3>
                <p>
                  ${includeCDN ? global.BASE_PRICE : global.BASE_PRICE_NO_CDN}{" "}
                  USD
                  <br />
                  +<br />
                  {includeCDN
                    ? (global.PRICE_PER_VIEWER * 100).toFixed(0)
                    : (global.PRICE_PER_VIEWER_NO_CDN * 100).toFixed(0)}
                  &#162; / Event Viewer<sup>1</sup>
                </p>
                {includeCDN ? (
                  <>
                    <hr />
                    <p>Event Up To 4 Hours Long</p>
                    <p className="subtext">
                      (Events that are longer than 4 hours, are billed an
                      additional 25&#162; / unique viewer per additional hour
                      <sup>2</sup>.)
                    </p>
                  </>
                ) : null}
              </div>
              <div
                className={`license-box right ${
                  event.registrationRequired ? "active" : ""
                }`}
              >
                <div className="license-box-label">
                  Current Event Type<sup>3</sup>
                </div>

                <h3>Registration Event</h3>
                <p>
                  ${includeCDN ? global.BASE_PRICE : global.BASE_PRICE_NO_CDN}{" "}
                  USD
                  <br />
                  +<br />
                  {includeCDN
                    ? (global.PRICE_PER_REGISTRATION * 100).toFixed(0)
                    : (global.PRICE_PER_REGISTRATION_NO_CDN * 100).toFixed(0)}
                  &#162; / Registration
                </p>
                {includeCDN ? (
                  <>
                    <hr />
                    <p>Event Up To 4 Hours Long</p>
                    <p className="subtext">
                      (Events that are longer than 4 hours, are billed an
                      additional 19&#162; / registration per additional hour
                      <sup>2</sup>.)
                    </p>
                  </>
                ) : null}
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
            <div style={{ margin: "0px 0px 20px", textAlign: "left" }}>
              <p className="subtext">
                <sup>1</sup> An Event Viewer is someone who viewed the event
                between the start and end time for at least 20 minutes.
              </p>
              <p className="subtext">
                <sup>2</sup> Event length is start time to end time (not
                including rehearsals, etc.). For events longer than 4 hours,
                send us a message using the chat in the bottom right.
              </p>
              <p className="subtext">
                <sup>3</sup>{" "}
                {event.registrationRequired
                  ? "If registration is switched off after enabling this license, the license will automatically switch to the Open Event license."
                  : "If registration is swtiched on after enabling this license, the license will automatically switch to the Registration Event license."}
              </p>
              <p className="subtext">
                License can be cancelled up until 1 hour before the event.
              </p>
              <p className="subtext">
                Registrations will be counted until the event end time.
              </p>
              <p className="subtext">
                Add now, pay later. You will be billed after your event is
                complete.
              </p>
            </div>

            <button className="Button1" onClick={handleClickAddEvent}>
              Add Event License
            </button>
            <p className="subtext" style={{ marginTop: "10px" }}>
              By clicking Add Event License, you agree to pay the invoiced
              amount sent 24 hours after the event end time within 14 days.
            </p>
          </div>
        }
      />
      <NavBar3
        displaySideNav="true"
        highlight="license"
        content={
          <div className="mainWrapper container-width">
            {/*If there is an event license present display the license. Otherwise display the draft mode message */}
            {event.License ? (
              <div
                className="form-box shadow-border"
                style={{
                  width: "550px",
                  margin: "auto",
                }}
              >
                {/*Determines whether to show the registration license or the open event license */}
                {event.registrationRequired ? (
                  <>
                    <div className="license-box center">
                      <h3>Registration Event</h3>
                      <p>
                        ${event.License.basePrice} USD
                        <br />
                        +<br />
                        {(event.License.pricePerRegistration * 100).toFixed(0)}
                        &#162; / Registration
                      </p>
                      <hr />
                      <p style={{ marginBottom: "10px" }}>
                        {event.License.includeCDN
                          ? "Content Delivery Network Included"
                          : "Bring Your Own Content Delivery Network"}
                      </p>
                      {event.License.includeCDN ? (
                        <>
                          <p>Event Up To 4 Hours Long</p>
                          <p className="subtext">
                            (Events that are longer than 4 hours, are billed an
                            additional 19 &#162; / registration per additional
                            hour
                            <sup>2</sup>.)
                          </p>
                        </>
                      ) : null}
                    </div>
                    <div style={{ margin: "20px 0px 20px", textAlign: "left" }}>
                      <p className="subtext">
                        <sup>2</sup> Event length is start time to end time (not
                        including rehearsals, etc.). For events longer than 4
                        hours send us a message using the chat in the bottom
                        right.
                      </p>
                      <p className="subtext">
                        License can be cancelled up until 1 hour before the
                        event.
                      </p>
                      <p className="subtext">
                        Registrations will be counted until the event end time.
                      </p>
                      <p className="subtext">
                        Add now, pay later. You will be billed after your event
                        is complete.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="license-box center">
                      <h3>Open Event</h3>
                      <p>
                        ${event.License.basePrice} USD
                        <br />
                        +<br />
                        {(event.License.pricePerViewer * 100).toFixed(0)}&#162;
                        / Event Viewer<sup>1</sup>
                      </p>
                      <hr />
                      <p style={{ marginBottom: "10px" }}>
                        {event.License.includeCDN
                          ? "Content Delivery Network included"
                          : "Bring your own Content Delivery Network"}
                      </p>
                      {event.License.includeCDN ? (
                        <>
                          <p>Event Up To 4 Hours Long</p>
                          <p className="subtext">
                            (Events that are longer than 4 hours, are billed an
                            additional 25&#162; / unique viewer per additional
                            hour
                            <sup>2</sup>.)
                          </p>
                        </>
                      ) : null}
                    </div>
                    <div style={{ margin: "20px 0px 20px", textAlign: "left" }}>
                      <p className="subtext">
                        <sup>1</sup> An Event Viewer is someone who viewed the
                        event between the start and end time for at least 20
                        minutes.
                      </p>
                      <p className="subtext">
                        <sup>2</sup> Event length is start time to end time (not
                        including rehearsals, etc.). For events longer than 4
                        hours send us a message using the chat in the bottom
                        right.
                      </p>
                      <p className="subtext">
                        License can be cancelled up until 1 hour before the
                        event.
                      </p>

                      <p className="subtext">
                        Add now, pay later. You will be billed after your event
                        is complete.
                      </p>
                    </div>
                  </>
                )}
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
                  Go back to draft mode or select different license
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  className="form-box shadow-border"
                  style={{ width: "550px", margin: "0px 16px" }}
                >
                  <h3 style={{ marginBottom: "30px" }}>
                    Your event is currently in draft mode.
                  </h3>
                  <p style={{ fontSize: "1rem" }}>
                    You may build, test, and demo your event website in draft
                    mode. A message will appear on your event website indicating
                    that you are currently in draft mode. Add a license below to
                    remove the message from your event website.
                  </p>

                  <p style={{ fontSize: "1rem" }}>
                    You will not be charged until after your event is complete.
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
