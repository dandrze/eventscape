import React, { useState, createElement } from "react";
import Froala from "./froala";
import { connect } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";

import Modal1 from "./Modal1";
import * as actions from "../actions";
import NewSectionButton from "./newSectionButton";
import DesignBlockToolbar from "./designBlockToolbar";
import mapReactComponent from "./mapReactComponent";
import theme from "../templates/theme";
import DesignBlockPicker from "./DesignBlockPicker";

const PageSectionEditor = ({
  event,
  model,
  sectionIndex,
  section,
  isHovering,
  setIsHovering,
}) => {
  const [open, setOpen] = useState(false);
  const [insertAfter, setInsertAfter] = useState(0);

  const openPickDesignBlock = (_insertAfter) => {
    setInsertAfter(_insertAfter);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(sectionIndex);
  };

  return (
    <div>
      <style>{theme(event.primaryColor)}</style>
      <Modal1
        open={open}
        onClose={handleClose}
        content={
          <DesignBlockPicker
            handleClose={handleClose}
            sectionIndex={insertAfter}
          />
        }
      />
      {/* Add an insert design block button before the section */}
      {isHovering === sectionIndex ? (
        <NewSectionButton
          openSectionPicker={() => openPickDesignBlock(sectionIndex - 1)}
        />
      ) : null}
      <div
        onMouseEnter={handleMouseEnter}
        // relative position ensures that the design block toolbar moves with the design block
        style={{ position: "relative" }}
      >
        <DesignBlockToolbar
          displayToolbar={
            isHovering === sectionIndex || model.simulateHover === sectionIndex
          }
          section={model.sections[sectionIndex]}
          sectionIndex={sectionIndex}
          maxIndex={model.sections.length}
        />
        {section.isReact ? (
          createElement(mapReactComponent[section.reactComponent.name], {
            ...section.reactComponent.props,
            sectionIndex: sectionIndex,
            key: sectionIndex,
            editMode: true,
          })
        ) : (
          <Froala
            sectionIndex={sectionIndex}
            html={model.sections[sectionIndex].html}
          />
        )}
      </div>
      {/* Add an insert design block button after the section */}

      {isHovering === sectionIndex ? (
        <NewSectionButton
          openSectionPicker={() => openPickDesignBlock(sectionIndex)}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(PageSectionEditor);
