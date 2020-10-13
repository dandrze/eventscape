import React, { Component } from "react";
import { connect } from "react-redux";

import "./regPageEditor.css";
import * as actions from "../actions";
import RegPageSectionEditor from "./regPageSectionEditor";
import { banner, hero, body } from "./regModel";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import Cancel from "../icons/cancel.svg";

class RegPageEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		this.props.fetchPageModel();
	}

	render() {
		return (
			<div>
				<Link to="./Design" id="cancelBar">
					<Tooltip title="Close Editor">
						<img src={Cancel} id="cancelIcon" height="24px"></img>
					</Tooltip>
				</Link>
				<div className="design">
					<div id="topButtons">
						<Link to="/Preview" id="preview">
							<button className="Button1">
								Preview Page As Guest
							</button>
						</Link>
						<button className="Button1" id="save">
							Save
						</button>
						<button className="Button1" id="publish">
							Publish
						</button>
						<br></br>
					</div>
					<div id="designBoard">
						<ul>
							{this.props.model.map(function (sectionModel,  index) {
								console.log(index)
								return (
									<li key={index}>
										<RegPageSectionEditor sectionIndex={index} />
									</li>
								);
							})}
						</ul>
					</div>
					<div style={{ color: "#F8F8F8" }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
						minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { model: state.model };
};

export default connect(mapStateToProps, actions)(RegPageEditor);
