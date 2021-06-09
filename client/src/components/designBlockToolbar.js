import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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
import AlertModal from "../components/AlertModal";

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
    top: "-32px",
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openBackgroundImage, setOpenBackgroundImage] = useState(false);
  const [sectionTooltip, setSectionTooltip] = useState("");
  const [editFormErrorOpen, setEditFormErrorOpen] = useState(false);

  // UseEffect mimicks OnComponentDidMount
  useEffect(() => {
    // set the section tooltip if it's a section that requires one, and if it's not a tour
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
    if (
      props.section.reactComponent.name === "RegistrationForm" &&
      props.event.plan.PlanType.type === "free"
    ) {
      setEditFormErrorOpen(true);
    } else {
      setOpenSettings(true);
    }
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

  const handleGoToPlan = () => {
    props.history.push("/plan");
  };

  return (
    <div>
      <AlertModal
        open={editFormErrorOpen}
        onClose={() => setEditFormErrorOpen(false)}
        onContinue={handleGoToPlan}
        content="The edit registration form option is available for events on a Pro plan. Please upgrade to continue."
        closeText="Close"
        continueText="Upgrade Now"
      />
      {/* Toolbar */}
      {(props.displayToolbar === true) &
      (openSettings === false) &
      (deleteConfirmOpen === false) ? (
        <div className="toolbar-container">
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
          {props.section.isReact &&
          props.section.reactComponent.name === "StreamChat" ? null : (
            // Show for any section other than stream chat
            <Tooltip title="Edit Block Background">
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

export default connect(
  mapStateToProps,
  actions
)(withRouter(DesignBlockToolbar));
