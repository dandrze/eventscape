import React, { Component } from "react";
import { connect } from "react-redux";
import { Prompt } from 'react-router'
import { ToastContainer} from 'react-toastify';

import "./pageEditor.css";
import * as actions from "../actions";
import PageSectionEditor from "./pageSectionEditor";
import { banner, hero, body } from "./designBlockModels";
import Tooltip from "@material-ui/core/Tooltip";
import { Link, withRouter } from "react-router-dom";
import Cancel from "../icons/cancel.svg";
import AlertModal from "./AlertModal";


class PageEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {open : false, location: null, confirmedNavigation: false,};

		this.showNavAlert = this.showNavAlert.bind(this)
		this.handleNavAlertClose = this.handleNavAlertClose.bind(this)
	}

	componentDidMount() {
		this.props.fetchModelFromState();	
	}

	showNavAlert(location) {
		this.setState({open: true, location})
	};

	handleBlockedNavigation = (nextLocation) => {
		const {model} = this.props;
		const {confirmedNavigation} = this.state

		if (!confirmedNavigation && this.props.model.isUnsaved){
			this.showNavAlert(nextLocation)
			return false
		}
		return true
	  }

	handleNavAlertClose() {
		this.setState({open: false})
	};

	handleNavAlertConfirm = () => {
		const {history} = this.props
		const {location} = this.state

		this.handleNavAlertClose();

		if (location) {
			this.setState({
				confirmedNavigation: true
			 }, () => {
				// Navigate to the previously blocked location now that the user confirmed     
				history.push(location.pathname)
			 })
		}
	  }


	render() {
		return (
			<div>
				<Prompt
				when={this.props.model.isUnsaved}
				message={this.handleBlockedNavigation}
				/>
				<AlertModal
					open={this.state.open}
					onClose={this.handleNavAlertClose}
					onContinue={() => {
						this.handleNavAlertConfirm();
					}}
					text="You have unsaved changes, are you sure you want to proceed?"
					closeText="Go back"
					continueText="Continue"
				/>

				<Link to="./design" id="cancelBar">
					<Tooltip title="Close Editor">
						<img src={Cancel} id="cancelIcon" height="24px"></img>
					</Tooltip>
				</Link>
				<div className="design">
					<div id="topButtons">
						<Link to={() => "/preview/" + (this.props.settings.nowEditingPage == "registration" ? this.props.event.reg_page_model : this.props.event.event_page_model)} target="_blank" id="preview" >
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
						{this.props.model.sections.map(function (section,  index) {
							return (
								<li key={section.id}>
									<PageSectionEditor section={section} sectionIndex={index} />
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
	return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(withRouter(PageEditor));
