import React from "react";
import { connect } from "react-redux";

import NavBar3 from "../components/navBar3.js";
import Tabs from "../components/Tabs";
import Table from "../components/MaterialTable.js";
import RegPageEditor from "../components/regPageEditor";

class Design extends React.Component {
	render() {
		console.log(this.props.event);
		return (
			<div>
				<NavBar3 displaySideNav="true" content={<RegPageEditor />} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { event: state.event };
};

export default connect(mapStateToProps)(Design);
