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

  return (
    <div>
      <section className="stream-chat-main-container">
        <div className="container-one-video-window">
          <div className="video-responsive">{displayStream()}</div>
        </div>
        <div className="container-two-chat-window">
          <div className="chat-responsive">
            <div id="video-responsive-iframe">
              <Chat
                room={props.chatRoom}
                isModerator={false}
                registrationId={props.attendee.id}
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
