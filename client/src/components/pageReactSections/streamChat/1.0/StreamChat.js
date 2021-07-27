import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import DangerousInnerHtml from "dangerously-set-html-content";
import "../../../fonts.css";
import "../../../pageEditor.css";
import "./StreamChat.css";
import Chat from "../../../chat4.js";

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
          <div>
            <div>
              <video playsInline autoPlay loop muted style={{ width: "100%" }}>
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
                    rel="noopener noreferrer"
                  >
                    supports HTML5 video
                  </a>
                </p>
              </video>
            </div>
          </div>
        );
      case "dacast":
        return (
          <>
            <Helmet>
              <style>
                {`.video-responsive > div > div > div {
                  position: inherit !important;
                }`}
              </style>
            </Helmet>
            <DangerousInnerHtml html={html} />
          </>
        );
      default:
        return <DangerousInnerHtml html={html} />;
    }
  };

  return (
    <div>
      <section className="stream-chat-main-container ">
        <div className="container-one-video-window inner-section-block">
          <div className="video-responsive ">{displayStream()}</div>
        </div>
        <div className="container-two-chat-window inner-section-block">
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
