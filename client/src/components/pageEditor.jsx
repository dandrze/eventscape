import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Prompt } from "react-router";

import CircularProgress from "@material-ui/core/CircularProgress";

import "./pageEditor.css";
import * as actions from "../actions";
import PageSectionEditor from "./pageSectionEditor";
import Tooltip from "@material-ui/core/Tooltip";
import { Link, withRouter } from "react-router-dom";
import Cancel from "../icons/cancel.svg";
import AlertModal from "./AlertModal";
import { pageNames } from "../model/enums";

const PageEditor = (props) => {
  const { history } = props;

  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    if (confirmedNavigation) {
      history.push(location.pathname);
    }
  }, [confirmedNavigation]);

  const showNavAlert = (nextLocation) => {
    setOpen(true);
    setLocation(nextLocation);
  };

  const handleBlockedNavigation = (nextLocation) => {
    if (!confirmedNavigation && props.model.isUnsaved) {
      showNavAlert(nextLocation);
      return false;
    }
    return true;
  };

  const handleNavAlertClose = () => {
    setOpen(false);
  };

  const handleNavAlertConfirm = () => {
    handleNavAlertClose();

    if (location) {
      setConfirmedNavigation(true);
    }
  };

  const handleDiscardAlertClose = () => {
    setDiscardOpen(false);
  };

  const handleDiscardAlertContinue = () => {
    handleCancelChanges();
    setDiscardOpen(false);
  };

  const handleCancelChanges = async () => {
    const modelId =
      props.page === "event"
        ? props.event.EventPageModelId
        : props.event.RegPageModelId;

    await props.fetchModel(modelId);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const res = await props.saveModel(props.page);
    setSaveLoading(false);
  };

  return (
    <div>
      <Prompt when={props.model.isUnsaved} message={handleBlockedNavigation} />
      <AlertModal
        open={open}
        onClose={handleNavAlertClose}
        onContinue={() => {
          handleNavAlertConfirm();
        }}
        text="You have unsaved changes, are you sure you want to proceed?"
        closeText="Go back"
        continueText="Continue"
      />

      <AlertModal
        open={discardOpen}
        onClose={handleDiscardAlertClose}
        onContinue={handleDiscardAlertContinue}
        text="Are you sure you want to discard your changes?"
        closeText="No"
        continueText="Yes"
      />

      <div className="design">
        <div className="top-button-bar">
          <Link
            className="button-bar-left"
            to={() =>
              "/preview/" +
              props.event.id +
              "/" +
              (props.page == pageNames.REGISTRATION
                ? props.event.RegPageModelId
                : props.event.EventPageModelId)
            }
            target="_blank"
          >
            <button className="Button1">Preview Page As Guest</button>
          </Link>
          {saveLoading ? (
            <div style={{ marginLeft: "auto", marginRight: "15px" }}>
              <CircularProgress />
            </div>
          ) : (
            <div style={{ flexGrow: 1, textAlign: "right" }}>
              {props.model.isUnsaved ? (
                <>
                  <button
                    className="Button1"
                    onClick={() => setDiscardOpen(true)}
                    style={{ marginLeft: "12px" }}
                  >
                    Discard Changes
                  </button>

                  <button
                    className="Button1"
                    onClick={handleSave}
                    style={{ marginLeft: "12px" }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <p
                  style={{
                    margin: "11px 16px",
                    color: "#2f2f2f",
                    fontSize: "18px",
                    fontWeight: 400,
                    fontStyle: "italic",
                  }}
                >
                  Saved
                </p>
              )}
            </div>
          )}
          <br></br>
        </div>
        <div id="designBoard">
          <ul>
            {props.model.sections.map(function (section, index) {
              return (
                <li key={section.id}>
                  <PageSectionEditor section={section} sectionIndex={index} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(withRouter(PageEditor));
