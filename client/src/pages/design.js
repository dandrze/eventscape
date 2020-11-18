import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import CircularProgress from "@material-ui/core/CircularProgress";

import NavBar3 from "../components/navBar3.js";
import PageEditor from "../components/pageEditor";
import "../components/fonts.css";

class Design extends React.Component {
	componentDidMount() {
		this.props.fetchEvent();
	}

	render() {
		return (
			<div>
				<NavBar3
					displaySideNav="true"
					content={
						this.props.settings.loaded ? (
							<PageEditor key={this.props.model} />
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
	return { event: state.event, model: state.model, settings: state.settings };
};

export default connect(mapStateToProps, actions)(Design);
