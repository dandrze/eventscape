import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import ReactHtmlParser from "react-html-parser";
import { useParams } from "react-router-dom";
import "froala-editor/css/froala_style.min.css";

const Preview = (props) => {
	const { id } = useParams();
	useEffect(() => {
		props.fetchModelFromId(id);
	}, []);

	return (
		<div class="fr-view">
			<ul>
				{props.model.sections.map(function (section) {
					console.log(section.html);
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
