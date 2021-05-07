import React, { useEffect, useRef } from "react";
import ReactHtmlParser from "react-html-parser";
import { connect } from "react-redux";
import "../fonts.css";
import "../pageEditor.css";
import "./stream-chat.css";
import Chat from "../chat4.js";
import { Helmet } from "react-helmet";

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
      case null:
        return (
          <>
            <Helmet>
              <link
                href="//vjs.zencdn.net/7.10.2/video-js.min.css"
                rel="stylesheet"
              />
              <script src="//vjs.zencdn.net/7.10.2/video.min.js"></script>
            </Helmet>
            <video-js
              id="my-player"
              class="video-js"
              data-setup='{"controls": false, "autoplay": "muted", "preload": "auto", "loop":true}'
              width={710}
            >
              <source
                src="https://eventscape-assets.s3.amazonaws.com/assets/default-event-video-v2-small.mp4"
                type="video/mp4"
              ></source>

              <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that
                <a
                  href="https://videojs.com/html5-video-support/"
                  target="_blank"
                >
                  supports HTML5 video
                </a>
              </p>
            </video-js>
          </>
        );
      default:
        return ReactHtmlParser(html);
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
