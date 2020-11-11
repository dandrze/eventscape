import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import ReactHtmlParser from "react-html-parser";

class Preview extends React.Component {
	render() {
		return (
			<div>
				<ul>
					{this.props.model.sections.map(function (sectionModel) {
						return ReactHtmlParser(sectionModel.html);
					})}
				</ul>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { model: state.model };
};

export default connect(mapStateToProps, actions)(Preview);
