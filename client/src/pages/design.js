import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import NavBar3 from "../components/navBar3.js";
import PageEditor from "../components/pageEditor";

class Design extends React.Component {
	componentWillMount() {
		this.props.fetchEvents();
	}

	render() {
		return (
			<div>
				<NavBar3 displaySideNav="true" content={<PageEditor />} />
			</div>
		);
	}
}

export default connect(null, actions)(Design);
