import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";

import NavBar3 from "../components/navBar3.js";
import * as actions from "../actions";
import api from "../api/server";

import { statusOptions } from "../model/enums";

const useStyles = makeStyles((theme) => ({
  halfCard: {
    padding: "50px",
    textAlign: "center",
    background: "#ffffff",
    margin: "30px",
    width: "50%",
  },

  paragraphText: {
    fontSize: "1rem",
  },
  spacer: {
    height: "1rem",
  },
}));

const ChecklistItem = ({ text, checked, hidden, handleCheckItem }) => {
  return (
    <div
      className="shadow-border"
      style={{
        padding: "10px",
        textAlign: "left",
        background: "#ffffff",
        margin: "10px",
        width: "100%",
        display: hidden ? "none" : "",
      }}
      onClick={handleCheckItem}
    >
      <Checkbox
        checked={checked}
        onChange={handleCheckItem}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <span
        style={{
          fontSize: "1rem",
          textDecoration: checked ? "line-through" : "",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const Dashboard = ({ event, registration, fetchRegistrations }) => {
  const classes = useStyles();

  useEffect(() => {
    fetchDataAsync();
  }, [event]);

  const fetchDataAsync = async () => {
    if (event.id) {
      fetchRegistrations(event.id);
    }
  };

  const handleCheckItem = (checklistItem) => {
    console.log("checked");
    const response = api.post("/api/event/checklist-item", {
      eventId: event.id,
      checklistItem,
    });
  };

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        highlight="dashboard"
        content={
          // only display content once the event is loaded
          event.id ? (
            <div className="container-width" style={{ textAlign: "left" }}>
              <div style={{ textAlign: "left" }}>
                <span className={classes.paragraphText}>
                  <Link to="/my-events" className="link1">
                    Events
                  </Link>{" "}
                  /{" "}
                  <Link to={`/?eventid=${event.id}`} className="link1">
                    {event.title}
                  </Link>
                </span>
              </div>
              <h2>{event.title}</h2>
              <div>
                <FiberManualRecordIcon
                  style={{
                    margin: "6px",
                    color:
                      event.status === statusOptions.ACTIVE
                        ? "#28a745"
                        : "#ffb200",
                  }}
                />
                <span className={classes.paragraphText}>{event.status}</span>
                <Tooltip title="Open link in new tab">
                  <a
                    href={`https://${event.link}.eventscape.io/`}
                    target="_blank"
                  >
                    <ExitToAppIcon
                      className="color-on-hover"
                      style={{ marginLeft: "24px", cursor: "pointer" }}
                    />

                    <span
                      style={{ marginLeft: "6px", fontSize: "1rem" }}
                    >{`https://${event.link}.eventscape.io/`}</span>
                  </a>
                </Tooltip>
              </div>
              <div style={{ display: "flex", margin: "1rem 0px" }}>
                <div className={"shadow-border " + classes.halfCard}>
                  <h3>Total Registrations</h3>
                  <h2>{registration.data.length}</h2>
                </div>
              </div>

              {/*  <div style={{ marginTop: "60px" }}>
                Event Onboarding Checklist
              </div>

              <ChecklistItem
                handleCheckItem={() => handleCheckItem("stream")}
                text={
                  <span>
                    Add a{" "}
                    <Link to="/design/event?stream=true">
                      <span className="link1">stream</span>
                    </Link>{" "}
                    to your event page.
                  </span>
                }
              />

              <ChecklistItem
                handleCheckItem={() => handleCheckItem("registration-page")}
                // Hide checklist item if registration is not required
                hidden={!event.registrationRequired}
                text={
                  <span>
                    Review your{" "}
                    <Link to="/design/registration">
                      <span className="link1">registration page</span>
                    </Link>{" "}
                    design.
                  </span>
                }
              />

              <ChecklistItem
                handleCheckItem={() => handleCheckItem("permissions")}
                text={
                  <span>
                    Add your{" "}
                    <Link to="/permissions">
                      <span className="link1">team members</span>
                    </Link>
                    .
                  </span>
                }
              />

              <ChecklistItem
                handleCheckItem={() => handleCheckItem("communication")}
                // Hide checklist item if registration is not required
                hidden={!event.registrationRequired}
                text={
                  <span>
                    Create your{" "}
                    <Link to="/communication">
                      <span className="link1">
                        registration, reminder and follow up emails
                      </span>
                      .
                    </Link>
                  </span>
                }
              />

              <ChecklistItem
                handleCheckItem={() => handleCheckItem("registrations")}
                // Hide checklist item if registration is not required
                hidden={!event.registrationRequired}
                text={
                  <span>
                    Customize your{" "}
                    <Link to="/registrations">
                      <span className="link1">registration form</span>.
                    </Link>
                  </span>
                }
              />

              <ChecklistItem
                handleCheckItem={() => handleCheckItem("polls")}
                text={
                  <span>
                    Create{" "}
                    <Link to="/polls">
                      <span className="link1">polls</span>
                    </Link>{" "}
                    to use during your event.
                  </span>
                }
              /> */}
            </div>
          ) : null
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    email: state.email,
    event: state.event,
    user: state.user,
    registration: state.registration,
  };
};

export default connect(mapStateToProps, actions)(Dashboard);
