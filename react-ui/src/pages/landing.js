import React from "react";
import { Link } from "react-router-dom";

export default class Landing extends React.Component {
	render() {
		return (
			<div>
				<h1>I'm a landing page</h1>
				<Link to="/Create_Account">
					<button className="Button1">Create FREE Event Website</button>
				</Link>
			</div>
		);
	}
}
