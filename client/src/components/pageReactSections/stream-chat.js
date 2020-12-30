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

  console.log("stream-chat refreshed");
  console.log(props.event.id);
  return (
    <div>
      <section class="container2">
        <div class="one2">
          <div className="video-responsive">{displayStream()}</div>
        </div>
        <div class="two2">
          <Chat room={props.event.id} />
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps)(StreamChat);
