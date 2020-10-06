import React, { Component } from "react";
import { connect } from "react-redux";
import Froala from "./froala";

import "./regPageEditor.css";
import * as actions from "../actions";

class RegPageEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="design">
				<div id="topButtons">
					<button className="Button1" id="preview">
						Preview Page As Guest
					</button>
					<button className="Button1" id="save">
						Save
					</button>
					<button className="Button1" id="publish">
						Publish
					</button>
					<br></br>
				</div>
				<div id="designBoard">
					<Froala />
				</div>
				<div style={{ color: "#F8F8F8" }}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat.
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { event: state.event };
};

export default connect(mapStateToProps, actions)(RegPageEditor);
