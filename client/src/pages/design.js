import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import CircularProgress from "@material-ui/core/CircularProgress";

import NavBar3 from "../components/navBar3.js";
import PageEditor from "../components/pageEditor";

class Design extends React.Component {
	componentDidMount() {
		if (this.props.event.loaded === false) {
			this.props.fetchEvent();
		}
	}

	render() {
		return (
			<div>
				<NavBar3
					displaySideNav="true"
					content={
						this.props.event.loaded ? (
							<PageEditor key={this.props.event} />
						) : (
							<CircularProgress />
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
