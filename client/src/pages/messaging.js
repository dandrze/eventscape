import React, { useEffect } from "react";
import { connect } from "react-redux";
import NavBar3 from "../components/navBar3.js";
import "./messaging.css";
import * as actions from "../actions";
import ModeratorDashboard from "../components/moderator/ModeratorDashboard.js";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import FoldingCube from "../components/FoldingCube";

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
                    <FoldingCube />
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
