import React from "react";
import Froala from "./froala";
import { connect } from "react-redux";
import * as actions from "../actions";

const RegPageSectionEditor = (props) => {
	return (
		<div>
			<Froala key={props.sectionModel} sectionModel={props.sectionModel} />
			<button
				className="addSection"
				onClick={() => {
					props.addSection();
				}}
			>
				Add Section
			</button>
		</div>
	);
};

export default connect(null, actions)(RegPageSectionEditor);
