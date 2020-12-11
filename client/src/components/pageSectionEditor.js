import React, { useState, createElement } from "react";
import Froala from "./froala";
import { connect } from "react-redux";
import * as actions from "../actions";
import NewSectionButton from "./newSectionButton";
import DesignBlockToolbar from "./designBlockToolbar";
import mapReactComponent from "./mapReactComponent";

const RegPageSectionEditor = (props) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const theme = `
 	.fr-view button { 
		background: ${props.event.primary_color} !important;
		border-color: ${props.event.primary_color} !important;
	 } 
	 .fr-view h1 {
		 color: ${props.event.primary_color};
	 }
	 .infoBar {
		background: ${props.event.primary_color};
	 }

	 .theme-button {
		background:${props.event.primary_color} !important;
	 }
	
  `;

  return (
    <div>
      <style>{theme}</style>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <DesignBlockToolbar
          displayToolbar={isHovering}
          section={props.model.sections[props.sectionIndex]}
          sectionIndex={props.sectionIndex}
          maxIndex={props.model.sections.length}
        />
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
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(RegPageSectionEditor);
