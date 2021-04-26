import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";
import BGVideo from "./led-wall-background-small.mp4";

export default class Landing extends React.Component {
  render() {
    return (
      <div>
        <div className="videoBackgroundOverlay">
          <video playsInline autoPlay loop muted className="videoBackground">
            <source src={BGVideo} type="video/mp4"></source>
          </video>
        </div>
        <header className="viewportHeader">
          <h2 className="landingHeader">
            Build a stunning livestream event website.
          </h2>
          <h2 className="landingHeader">Get started in seconds.</h2>
          <p className="coming">Coming Winter 2021</p>
          {/*<Link to="/signup">
						<button className="Button1 CTAButton">Create Event Website</button>
					</Link>*/}
        </header>
      </div>
    );
  }
}

// Background video options:
// https://ak.picdn.net/shutterstock/videos/19772026/preview/stock-footage-bright-colored-led-smd-video-wall-with-high-saturated-patterns-close-up-video.webm
