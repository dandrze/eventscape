import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import NavBar3 from "../components/navBar3.js";
import "./messaging.css";
import { makeStyles } from "@material-ui/core/styles";
import * as actions from "../actions";
import ModeratorDashboard from "../components/moderator/ModeratorDashboard.js";
import { CircularProgress } from "@material-ui/core";
import AccessDeniedScreen from "../components/AccessDeniedScreen";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Messaging = (props) => {
  const [chatRooms, setChatRooms] = React.useState([]);

  useEffect(() => {
    fetchData();
  }, [props.event.id]);

  const fetchData = async () => {
    if (props.event.id) {
      const chatRooms = await props.fetchChatRooms(props.event.id);
      setChatRooms(chatRooms.data);
    }
  };

  return (
    <div>
      <div id="accountId" style={{ display: "none" }}>
        123
      </div>
      <NavBar3
        displaySideNav="true"
        highlight="messaging"
        content={
          // only display content once the event is loaded
          props.event.id ? (
            props.event.permissions?.messaging ? (
              <div className="mainWrapper container-width">
                {chatRooms.length ? (
                  chatRooms.map((chatRoom) => {
                    return <ModeratorDashboard room={chatRoom} />;
                  })
                ) : (
                  <div className="form-box shadow-border">
                    <CircularProgress />
                  </div>
                )}
              </div>
            ) : (
              <AccessDeniedScreen message="Please contact the event owner to provide you with permissions to this page." />
            )
          ) : null
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(Messaging);
