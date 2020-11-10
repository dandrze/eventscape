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
		this.props.fetchPublishedPage(this.props.subdomain);
	}

	renderPage() {
		console.log(this.props.model.sections.length ? "true" : false);
		if (this.props.model.loaded && this.props.model.sections.length) {
			return (
				<ul>
					{this.props.model.sections.map(function (section) {
						return ReactHtmlParser(section.html);
					})}
				</ul>
			);
		} else if (this.props.model.loaded) {
			return <p>No Event Found</p>;
		} else {
			return <CircularProgress />;
		}
	}

	render() {
		return <div>{this.renderPage()}</div>;
	}
}

const mapStateToProps = (state) => {
	return { model: state.model };
};

export default connect(mapStateToProps, actions)(Published);
