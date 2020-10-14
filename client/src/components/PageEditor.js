import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import RegPageSectionEditor from "./regPageSectionEditor";

const PageEditor = (props) => {
	return (
		<ul>
            {props.model.map(function (sectionModel,  index) {
                console.log(index)
                return (
                    <li key={index}>
                        <RegPageSectionEditor sectionIndex={index} />
                    </li>
                );
            })}
        </ul>
	);
};
const mapStateToProps = (state) => {
	return { model: state.model };
};

export default connect(mapStateToProps, actions)(PageEditor);
