import React, { useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { connect } from "react-redux";
import "../fonts.css";
import "../pageEditor.css";
import "./stream-chat.css";
import Chat from "../chat4.js";

const StreamChat = (props) => {
  const displayStream = () => {
    const youtubeSrc =
      props.link +
      "?rel=0;&modestbranding=1&showinfo=0&autoplay=1&mute=1&loop=1";

    switch (props.content) {
      case "youtube-live":
        return (
          <iframe
            id="video-responsive-iframe"
            src={youtubeSrc}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      case "custom-embed":
        return ReactHtmlParser(props.html);
      default:
        return <p>Unknown Error</p>;
    }
  };

  // if there is an attendee object in redux, show the attendees name, else show Guest1234 (random number)
  const name = props.attendee.first_name
    ? props.attendee.first_name + " " + props.attendee.last_name
    : "Guest" + Math.floor(Math.random() * 1000).toString();

  return (
    <div>
      <section class="stream-chat-main-container">
        <div class="container-one-video-window">
          <div className="video-responsive">{displayStream()}</div>
        </div>
        <div class="container-two-chat-window">
          <div className="chat-responsive">
            <div id="video-responsive-iframe">
              <Chat
                room={props.chatRoom}
                name={name}
                isModerator={false}
                userId={props.attendee.id}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, attendee: state.attendee };
};

export default connect(mapStateToProps)(StreamChat);
