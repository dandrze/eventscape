import React, { useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { connect } from "react-redux";
import "../fonts.css";
import "../pageEditor.css";
import "./stream-chat.css";
import Chat from "../chat4.js";

const StreamChat = ({ link, content, html, chatRoom, attendee }) => {
  const createEmbedLink = (youtubeLink) => {
    const splitLink = youtubeLink.split("/");
    var streamCode = splitLink[splitLink.length - 1];

    // strip away the watch portion if exists
    streamCode = streamCode.replace("watch?v=", "");

    // strip away any additional params after the stream code
    streamCode = streamCode.split("?")[0];
    streamCode = streamCode.split("&")[0];

    return `https://www.youtube.com/embed/${streamCode}?rel=0;&modestbranding=1&showinfo=0&autoplay=1&mute=1&loop=1`;
  };

  const displayStream = () => {
    const youtubeSrc = createEmbedLink(link);

    switch (content) {
      case "youtube-live":
        return (
          <iframe
            className="video-responsive-iframe"
            src={youtubeSrc}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      case "custom-embed":
        return ReactHtmlParser(html);
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
            <div className="video-responsive-iframe">
              <Chat
                room={chatRoom}
                isModerator={false}
                registrationId={attendee.id}
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
