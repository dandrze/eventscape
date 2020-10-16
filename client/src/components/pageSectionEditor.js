import React from "react";
import Froala from "./froala";
import { connect } from "react-redux";
import * as actions from "../actions";
import NewSectionButton from "./newSectionButton";

const RegPageSectionEditor = (props) => {
	return (
		<div>
			<Froala key={props.model} sectionIndex={props.sectionIndex} />
			<NewSectionButton prevIndex={props.sectionIndex} />
		</div>
	);
};
const mapStateToProps = (state) => {
	return { model: state.model };
};

export default connect(mapStateToProps, actions)(RegPageSectionEditor);
