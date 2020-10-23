import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import CircularProgress from "@material-ui/core/CircularProgress";

import NavBar3 from "../components/navBar3.js";
import PageEditor from "../components/pageEditor";

class Design extends React.Component {
	componentWillMount() {
		this.props.fetchEvents();
	}

	render() {
		return (
			<div>
				<NavBar3
					displaySideNav="true"
					content={
						this.props.event.length === 0 ? (
							<CircularProgress />
						) : (
							<PageEditor key={this.props.event} />
						)
					}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { event: state.event };
};

export default connect(mapStateToProps, actions)(Design);
