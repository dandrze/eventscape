import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import NavBar3 from "../components/navBar3.js";
import PageEditorContainer from "../components/pageEditorContainer";

class Design extends React.Component {
	render() {
		return (
			<div>
				<NavBar3 displaySideNav="true" content={<PageEditorContainer />} />
			</div>
		);
	}
}

export default connect(null, actions)(Design);
