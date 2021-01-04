import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import NavBar3 from "../components/navBar3.js";
import "./messaging.css";
import { makeStyles } from "@material-ui/core/styles";
import * as actions from "../actions";
import ModeratorChat from "../components/ModeratorChat.js";

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
      <NavBar3
        displaySideNav="true"
        highlight="messaging"
        content={
          <div className="mainWrapper container-width">
            {chatRooms.map((chatRoom) => {
              return <ModeratorChat room={chatRoom.id} />;
            })}

            <div className="form-box shadow-border">
              <h3>Q&A</h3>
            </div>
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(Messaging);
