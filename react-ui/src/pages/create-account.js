import React from "react";
import { Link } from "react-router-dom";

export default class Create_Account extends React.Component {
	render() {
		return (
			<div className="form-box">
				<h1>
					Create your<br></br>free account to<br></br>continue.
				</h1>
				<form>
					<label for="email">Email Address</label>
					<br></br>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="email@email.com"
					></input>
					<br></br>
					<label for="pw">Password</label>
					<br></br>
					<input type="text" id="pw" name="pw" placeholder="Password"></input>
					<br></br>
					<br></br>
				</form>
				<Link to="/Event_Details">
					<button className="Button1">Create My Account</button>
				</Link>
			</div>
		);
	}
}
