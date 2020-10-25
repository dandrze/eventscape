import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";

export default class Landing extends React.Component {
	render() {
		return (
			<div>
				<div className="videoBackgroundOverlay">
				<video playsInline autoPlay loop muted src="https://ak.picdn.net/shutterstock/videos/19772026/preview/stock-footage-bright-colored-led-smd-video-wall-with-high-saturated-patterns-close-up-video.webm" type="video/mp4" className="videoBackground"></video>
				</div>
				<div className="viewportHeader">
					<h2 className="landingHeader">Build a stunning livestream event website.</h2>
					<h2 className="landingHeader">Get started in seconds.</h2>
					<Link to="/Create_Account">
						<button className="Button1 CTAButton">Create Event Website</button>
					</Link>
				</div>
			</div>
		);
	}
}

// Background video options: 
// https://ak.picdn.net/shutterstock/videos/19772026/preview/stock-footage-bright-colored-led-smd-video-wall-with-high-saturated-patterns-close-up-video.webm