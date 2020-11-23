import React from "react";
import NavBar3 from "../components/navBar3.js";
import "../components/fonts.css";
import "../components/pageEditor.css";
import "./stream-chat.css";
import Chat from "../components/chat4.js";

class StreamChat extends React.Component {
	render() {
		return (
			<div>
				<NavBar3
					displaySideNav="true"
					content={
						<div>
							<div className="design">
								<div id="designBoard">
									<section class="container2">
										<div class="one2">
											<div className="video-responsive">
												<iframe
													id="video-responsive-iframe"
													src="https://www.youtube.com/embed/X9llog6QNVM??rel=0;&modestbranding=1&showinfo=0&autoplay=1&mute=1&loop=1"
													frameBorder="0"
													allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
													allowFullScreen
												></iframe>
											</div>
										</div>
										<div class="two2">
											<Chat />
										</div>
									</section>
								</div>
								<div style={{ color: "#F8F8F8" }}>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud exercitation ullamco
									laboris nisi ut aliquip ex ea commodo consequat.
								</div>
							</div>
						</div>
					}
				/>
			</div>
		);
	}
}

export default StreamChat;
