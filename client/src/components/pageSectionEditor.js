import React, { useState, createElement } from "react";
import Froala from "./froala";
import { connect } from "react-redux";
import * as actions from "../actions";
import NewSectionButton from "./newSectionButton";
import DesignBlockToolbar from "./designBlockToolbar";
import mapReactComponent from "./mapReactComponent";
import theme from "../templates/theme";

const PageSectionEditor = (props) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div>
      <style>{theme(props.event.primaryColor)}</style>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <DesignBlockToolbar
          displayToolbar={isHovering}
          section={props.model.sections[props.sectionIndex]}
          sectionIndex={props.sectionIndex}
          maxIndex={props.model.sections.length}
        />
        {props.section.isReact ? (
          createElement(mapReactComponent[props.section.reactComponent.name], {
            ...props.section.reactComponent.props,
            sectionIndex: props.sectionIndex,
          })
        ) : (
          <Froala
            sectionIndex={props.sectionIndex}
            html={props.model.sections[props.sectionIndex].html}
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

export default connect(mapStateToProps, actions)(PageSectionEditor);
