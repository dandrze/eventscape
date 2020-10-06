import React from "react";
import Froala from "./froala";
import regModel from "./regModel";

const regPageSectionEditor = (props) => {
	return (
		<div>
			<Froala sectionModel={regModel} />
		</div>
	);
};

export default regPageSectionEditor;
