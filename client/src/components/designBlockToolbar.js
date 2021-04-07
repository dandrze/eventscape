import React, { useEffect } from "react";
import { connect } from "react-redux";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import SettingsIcon from "@material-ui/icons/Settings";
import "./designBlockToolbar.css";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import CropOriginalIcon from "@material-ui/icons/CropOriginal";
import * as actions from "../actions";
import Modal1 from "./Modal1";
import DesignBlockSettings from "./designBlockSettings";
import BackgroundImageSelector from "./BackgroundImageSelector";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: "600px",
  },
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  sectionTooltip: {
    position: "absolute",
    top: "-30px",
    background: "#7b7b7b",
    border: "1px solid #777777",
    padding: "8px",
    fontSize: "12px",
    color: "#ffffff",
    borderRadius: "5px",
    opacity: "0.85",
  },
}));

function DesignBlockToolbar(props) {
  const classes = useStyles();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);
  const [openBackgroundImage, setOpenBackgroundImage] = React.useState(false);
  const [sectionTooltip, setSectionTooltip] = React.useState("");

  // UseEffect mimicks OnComponentDidMount
  useEffect(() => {
    // set the section tooltip if it's a section that requires one
    if (props.section.isReact) {
      switch (props.section.reactComponent.name) {
        case "StreamChat":
          setSectionTooltip(
            "Click the gears icon to add your stream and change chat/question settings"
          );
          break;
        case "RegistrationForm":
          setSectionTooltip(
            "Click the gears icon to edit the registration form"
          );
          break;
      }
    }
  }, []);

  const showSettings =
    (props.section.isReact &&
      props.section.reactComponent.name == "StreamChat") ||
    (props.section.isReact &&
      props.section.reactComponent.name == "RegistrationForm");

  const handleClickDelete = () => {
    if (props.model.sections.length >= 2) setDeleteConfirmOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    props.deleteSection(props.sectionIndex, props.section);
  };

  // Settings:
  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    props.triggerSectionReactUpdate();
    setOpenSettings(false);
  };

  const handleCloseBackgroundSettings = () => {
    props.triggerSectionReactUpdate();
    setOpenBackgroundImage(false);
  };

  const handleClickEditBackgroundImage = () => {
    setOpenBackgroundImage(true);
  };

  const handleClickMove = (offset) => {
    if (
      props.sectionIndex + offset >= 0 &&
      props.sectionIndex + offset <= props.maxIndex - 1
    ) {
      props.moveSection(props.sectionIndex, offset);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      {(props.displayToolbar === true) &
      (openSettings === false) &
      (deleteConfirmOpen === false) ? (
        <div className="toolbar_container">
          <Tooltip title="Move Up">
            <div
              className="design-block-toolbar-button"
              onClick={() => handleClickMove(-1)}
            >
              <KeyboardArrowUpIcon />
            </div>
          </Tooltip>
          <Tooltip title="Move Down">
            <div
              className="design-block-toolbar-button"
              onClick={() => handleClickMove(1)}
            >
              <KeyboardArrowDownIcon />
            </div>
          </Tooltip>
          <Tooltip title="Delete Design Block">
            <div
              className="design-block-toolbar-button"
              onClick={handleClickDelete}
            >
              <DeleteOutlined />
            </div>
          </Tooltip>
          {props.section.isReact ? null : (
            // Only show if it is not a react section (it is a froala section)
            <Tooltip title="Edit Background image">
              <div
                className="design-block-toolbar-button"
                onClick={handleClickEditBackgroundImage}
              >
                <CropOriginalIcon />
              </div>
            </Tooltip>
          )}
          {showSettings ? (
            <>
              <Tooltip title="Settings">
                <div
                  className="design-block-toolbar-button"
                  onClick={handleOpenSettings}
                >
                  <SettingsIcon />
                </div>
              </Tooltip>
            </>
          ) : null}
          {sectionTooltip ? (
            <div className={classes.sectionTooltip}>{sectionTooltip}</div>
          ) : null}
        </div>
      ) : null}

      {/* Confirm Delete */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete design block?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleCloseDelete();
              handleConfirmDelete();
            }}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/*Section Settings Modal: */}
      <Modal1
        open={openSettings}
        onClose={handleCloseSettings}
        content={
          <DesignBlockSettings
            reactComponent={props.section.reactComponent}
            isReact={props.section.isReact}
            sectionIndex={props.sectionIndex}
            onClose={handleCloseSettings}
          />
        }
      />

      {/*Background Image Modal. */}

      <Modal1
        open={openBackgroundImage}
        onClose={handleCloseBackgroundSettings}
        isSideModal={true}
        content={
          <BackgroundImageSelector
            sectionIndex={props.sectionIndex}
            handleClose={handleCloseBackgroundSettings}
          />
        }
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model };
};

export default connect(mapStateToProps, actions)(DesignBlockToolbar);
