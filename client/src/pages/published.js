import React from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";

class Published extends React.Component {
	constructor(props) {
		super(props);
		this.state = { status: "loading" };
	}
	async componentDidMount() {
		// #TODO set up a new action creator that finds the event based on the subdomain name
		const event = await this.props.fetchPublishedPage(this.props.subdomain);
		if (event.data) {
			this.setState({ status: "eventFound" });
		} else {
			this.setState({ status: "eventNotFound" });
		}
	}

	renderPage() {
		switch (this.state.status) {
			case "eventNotFound":
				return <p>No Event Found</p>;
			case "eventFound":
				return (
					<ul>
						{this.props.event.regPageModel.map(function (sectionModel) {
							return ReactHtmlParser(sectionModel.sectionHtml);
						})}
					</ul>
				);
			default:
				return <CircularProgress />;
		}
	}

	render() {
		return <div>{this.renderPage()}</div>;
	}
}

const mapStateToProps = (state) => {
	return { event: state.event };
};

export default connect(mapStateToProps, actions)(Published);
