import React, { Component } from "react";
import { connect } from "react-redux";
import { Prompt } from 'react-router'
import { ToastContainer} from 'react-toastify';

import "./pageEditor.css";
import * as actions from "../actions";
import PageSectionEditor from "./pageSectionEditor";
import { banner, hero, body } from "./designBlockModels";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import Cancel from "../icons/cancel.svg";

class PageEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		this.props.fetchPageModel();
		console.log(this.props.key);
	}


	render() {
		return (
			<div>
				<Prompt
				when={this.props.model.isUnsaved}
				message='You have unsaved changes, are you sure you want to leave?'
				/>
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
						<button className="Button1" id="save" onClick={this.props.saveModel}>
							Save
						</button>
						<button className="Button1" id="publish" onClick={this.props.publishPage}>
							Publish
						</button>
						<br></br>
					</div>
					<div id="designBoard">
					<ul>
						{this.props.model.sections.map(function (sectionModel,  index) {
							return (
								<li key={sectionModel.id}>
									<PageSectionEditor model={sectionModel} sectionIndex={index} />
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
	return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(PageEditor);
