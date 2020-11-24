import React, { useState, createElement } from "react";
import Froala from "./froala";
import { connect } from "react-redux";
import * as actions from "../actions";
import NewSectionButton from "./newSectionButton";
import DesignBlockToolbar from "./designBlockToolbar";
import StreamChat from "../components/pageReactSections/stream-chat";

const RegPageSectionEditor = (props) => {
	const [isHovering, setIsHovering] = useState(false);

	const handleMouseEnter = () => {
		setIsHovering(true);
	};

	const handleMouseLeave = () => {
		setIsHovering(false);
	};

	const mapReactComponent = {
		StreamChat: StreamChat,
	};

	return (
		<div>
			<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				{isHovering && (
					<DesignBlockToolbar
						section={props.model.sections[props.sectionIndex]}
						sectionIndex={props.sectionIndex}
						maxIndex={props.model.sections.length}
					/>
				)}
				{props.section.is_react ? (
					createElement(
						mapReactComponent[props.section.react_component.name],
						props.section.react_component.props
					)
				) : (
					<Froala
						key={props.model.sections}
						sectionIndex={props.sectionIndex}
					/>
				)}
			</div>
			<NewSectionButton prevIndex={props.sectionIndex} />
		</div>
	);
};

const mapStateToProps = (state) => {
	return { model: state.model };
};

export default connect(mapStateToProps, actions)(RegPageSectionEditor);
