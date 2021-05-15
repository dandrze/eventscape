import React, { useEffect, useState, forwardRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { makeStyles } from "@material-ui/core/styles";

import NavBar3 from "../components/navBar3.js";
import * as actions from "../actions";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  halfCard: {
    padding: "50px",
    textAlign: "center",
    background: "#ffffff",
    margin: "30px",
    width: "50%",
  },
  fullCard: {
    padding: "50px",
    textAlign: "left",
    background: "#ffffff",
    margin: "30px",
    width: "100%",
  },
  paragraphText: {
    fontSize: "1rem",
  },
  spacer: {
    height: "1rem",
  },
}));

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

  const copyLink = (event) => {
    event.target.select();
    document.execCommand("copy");
    toast.success("Event link copied to clipboard!", {
      autoClose: 1500,
      pauseOnHover: false,
    });
  };

  return (
    <div className="container-width">
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
                  style={{ margin: "6px", color: "#28a745" }}
                />
                <span className={classes.paragraphText}>Live</span>

                <ExitToAppIcon
                  className="color-on-hover"
                  style={{ marginLeft: "24px", cursor: "pointer" }}
                  onClick={copyLink}
                />

                <span
                  style={{ marginLeft: "6px", fontSize: "1rem" }}
                >{`https://${event.link}.eventscape.io/`}</span>
              </div>
              <div style={{ display: "flex", margin: "1rem 0px" }}>
                <div className={"shadow-border " + classes.halfCard}>
                  <h3>Total Registrations</h3>
                  <h2>{registration.data.length}</h2>
                </div>
              </div>

              {/*  <div>Event Checklist</div>
              <div className={"shadow-border " + classes.fullCard}>
                <h3>Prepare your registration emails.</h3>
                <div className={classes.paragraphText}>
                  Create your registration emails which are sent to users when
                  they sign up. We have a few templates to get you started.
                </div>
                <div className={classes.spacer} />
                <button
                  className="Button1"
                  //onClick={handleAddReg}
                  //style={{ marginLeft: "20px" }}
                >
                  Create registration email
                </button>
              </div>
              <div className={"shadow-border " + classes.fullCard}>
                Checklist item
              </div> */}
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
