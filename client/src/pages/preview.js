import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import ReactHtmlParser from "react-html-parser";
import { useParams } from "react-router-dom";

const Preview = (props) => {
	const { id } = useParams();
	useEffect(() => {
		props.fetchModelFromId(id);
	}, []);

	return (
		<div>
			<ul>
				{props.model.sections.map(function (section) {
					return ReactHtmlParser(section.html);
				})}
			</ul>
		</div>
	);
};

const mapStateToProps = (state) => {
	return { model: state.model };
};

export default connect(mapStateToProps, actions)(Preview);
