import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import PageSectionEditor from "./pageSectionEditor";

const PageEditor = (props) => {
    console.log(props.model)
	return (
		<ul>
            {props.model.map(function (sectionModel,  index) {
                console.log(index)
                return (
                    <li key={index}>
                        <PageSectionEditor sectionIndex={index} />
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
