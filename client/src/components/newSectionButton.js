import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const NewSectionButton = (props) => {
	return (
		<button
			className="addSection"
			onClick={() => {
				props.addSection(props.prevIndex);
			}}
		>
			<AddCircleIcon />
		</button>
		/* drop down button will go here to select the type of section */
	);
};

export default connect(null, actions)(NewSectionButton);
