import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import "react-colorful/dist/index.css";
import * as actions from "../actions";
import Modal1 from "./Modal1";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SelectEventType = ({ handleContinue }) => {
  const classes = useStyles();

  const [displayRegText, setDisplayRegText] = useState(false);
  const [displayEventText, setDisplayEventText] = useState(false);
  const [screenshot, setScreenshot] = useState("");

  const handleClickScreenshot = (targetUrl) => {
    setScreenshot(targetUrl);
  };

  return (
    <>
      <Modal1
        open={screenshot}
        onClose={() => setScreenshot("")}
        content={
          <img
            src={screenshot}
            width="800px"
            className="shadow-border"
            style={{
              border: "1px solid #e8e8e8",
              margin: "15px",
            }}
          />
        }
      />
      <div>
        <h1 className="title">Select Event Type</h1>
        <div
          className="form-box shadow-border event-details-box"
          style={{ width: "950px" }}
        >
          <div>
            <h2 style={{ color: "#b0281c" }}>Private</h2>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <p
                style={{ color: "#b0281c", fontWeight: 400, marginTop: "16px" }}
              >
                Choose this option if your event required registration
              </p>

              <p style={{}}>
                Your guests will register on the event page. Then they will be
                sent an invitation email with a unique link to access your
                livestream page.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "16px",
              }}
            >
              <div
                onMouseEnter={() => setDisplayRegText(true)}
                onMouseLeave={() => setDisplayRegText(false)}
                style={{
                  position: "relative",
                  width: "430px",
                  height: "400px",
                }}
              >
                {displayRegText ? (
                  <div
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      background: "rgba(70,70,70,0.6)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleClickScreenshot(
                        "https://eventscape-assets.s3.amazonaws.com/assets/registration-page.png"
                      )
                    }
                  >
                    Registration Page
                  </div>
                ) : null}
                <img
                  src="https://eventscape-assets.s3.amazonaws.com/assets/registration-page.png"
                  width="400px"
                  className="shadow-border"
                  style={{
                    border: "1px solid #e8e8e8",
                    margin: "15px",
                  }}
                />
              </div>
              <div
                onMouseEnter={() => setDisplayEventText(true)}
                onMouseLeave={() => setDisplayEventText(false)}
                style={{
                  position: "relative",
                  width: "430px",
                  height: "400px",
                }}
              >
                {displayEventText ? (
                  <div
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      background: "rgba(70,70,70,0.6)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleClickScreenshot(
                        "https://eventscape-assets.s3.amazonaws.com/assets/event-page.png"
                      )
                    }
                  >
                    Private Event Page
                  </div>
                ) : null}
                <img
                  src="https://eventscape-assets.s3.amazonaws.com/assets/event-page.png"
                  width="400px"
                  className="shadow-border"
                  style={{
                    border: "1px solid #e8e8e8",
                    margin: "15px",
                  }}
                />
              </div>
            </div>
            <Divider />

            <button
              className="Button1"
              style={{ width: "200px", margin: "30px auto" }}
              onClick={() => handleContinue("Private")}
            >
              Continue
            </button>
          </div>
        </div>

        <div>
          <div
            className="form-box shadow-border event-details-box"
            style={{ width: "950px" }}
          >
            <div>
              <h2 style={{ color: "#b0281c" }}>Public</h2>
              <Divider />

              <div>
                <p
                  style={{
                    color: "#b0281c",
                    fontWeight: 400,
                    marginTop: "16px",
                  }}
                >
                  Choose this option if your event is open to everyone
                </p>
                <p style={{}}>
                  No registration required, anyone with the link can view your
                  event.
                </p>
              </div>
              <div
                onMouseEnter={() => setDisplayEventText(true)}
                onMouseLeave={() => setDisplayEventText(false)}
                style={{
                  position: "relative",
                  width: "430px",
                  margin: "16px auto 0px",
                }}
              >
                {displayEventText ? (
                  <div
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      background: "rgba(70,70,70,0.6)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleClickScreenshot(
                        "https://eventscape-assets.s3.amazonaws.com/assets/event-page.png"
                      )
                    }
                  >
                    Public Event Page
                  </div>
                ) : null}
                <img
                  src="https://eventscape-assets.s3.amazonaws.com/assets/event-page.png"
                  width="400px"
                  className="shadow-border"
                  style={{
                    border: "1px solid #e8e8e8",
                    margin: "15px",
                  }}
                />
              </div>
              <Divider />

              <button
                className="Button1"
                style={{ width: "200px", margin: "30px auto" }}
                onClick={() => handleContinue("public")}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(withRouter(SelectEventType));
