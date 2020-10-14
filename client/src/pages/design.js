import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import NavBar3 from "../components/navBar3.js";
import pageEditorContainer from "../components/pageEditorContainer";

class Design extends React.Component {
	render() {
		return (
			<div>
				<NavBar3 displaySideNav="true" content={<pageEditorContainer />} />
			</div>
		);
	}
}

export default connect(null, actions)(Design);
