import React from "react";
import Froala from "./froala";
import { connect } from "react-redux";
import * as actions from "../actions";
import NewSectionButton from "./newSectionButton";

const RegPageSectionEditor = (props) => {
	console.log(props.sectionModel);
	return (
		<div>
			<Froala key={props.sectionModel} sectionModel={props.sectionModel} />
			<NewSectionButton />
		</div>
	);
};

export default connect(null, actions)(RegPageSectionEditor);
