import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Prompt } from "react-router";
import { Link, withRouter } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import Tooltip from "@material-ui/core/Tooltip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import FoldingCube from "./FoldingCube";
import "./pageEditor.css";
import * as actions from "../actions";
import PageSectionEditor from "./pageSectionEditor";
import AlertModal from "./AlertModal";
import { pageNames } from "../model/enums";
import BrandingTop from "./BrandingTop";
import BrandingBottom from "./BrandingBottom";
import Modal1 from "./Modal1";
import BackgroundImageSelector from "./BackgroundImageSelector";
import IconButton from "./IconButton";

const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/" : "/";

let socket;

const PageEditor = ({ history, model, event, page, fetchModel, saveModel }) => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [removeLogoErrorOpen, setRemoveLogoErrorOpen] = useState(false);
  const [openBackgroundImage, setOpenBackgroundImage] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showRefreshConfirmation, setShowRefreshConfirmation] = useState(false);

  useEffect(() => {
    if (confirmedNavigation) {
      history.push(location.pathname);
    }
  }, [confirmedNavigation]);

  useEffect(() => {
    socket = io(ENDPOINT, {
      path: "/api/socket/event",
      transports: ["websocket"],
    });

    socket.emit("join", {
      EventId: event.id,
      isModerator: true,
    });
  });

  const showNavAlert = (nextLocation) => {
    setOpen(true);
    setLocation(nextLocation);
  };

  const handleBlockedNavigation = (nextLocation) => {
    if (!confirmedNavigation && model.isUnsaved) {
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

  const handleRemoveLogoError = () => {
    setRemoveLogoErrorOpen(true);
  };

  const handleRemoveLogoErrorClose = () => {
    setRemoveLogoErrorOpen(false);
  };

  const handleRemoveLogoErrorContinue = () => {
    setRemoveLogoErrorOpen(false);
    history.push("/package");
  };

  const handleCancelChanges = async () => {
    const modelId =
      page === "event" ? event.EventPageModelId : event.RegPageModelId;

    await fetchModel(modelId);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const res = await saveModel(page);
    setSaveLoading(false);
  };

  const handleClickEditBackground = () => {
    setOpenBackgroundImage(true);
  };

  const handleClickAdvanced = () => {
    setShowAdvancedOptions(true);
  };

  const handleClickRefresh = () => {
    setShowAdvancedOptions(false);
    setShowRefreshConfirmation(true);
  };

  const handlePushRefresh = () => {
    setShowRefreshConfirmation(false);
    socket.emit("pushRefreshPage", event.id);
    toast.success("Successfully refreshed page content for all viewers");
  };

  const handleCloseBackgroundSettings = () => {
    setOpenBackgroundImage(false);
  };

  const handleMouseLeave = () => {
    setIsHovering(null);
  };

  return (
    <div>
      <Prompt when={model.isUnsaved} message={handleBlockedNavigation} />
      <AlertModal
        open={open}
        onClose={handleNavAlertClose}
        onContinue={() => {
          handleNavAlertConfirm();
        }}
        content="You have unsaved changes, are you sure you want to proceed?"
        closeText="Go back"
        continueText="Continue"
      />

      <AlertModal
        open={showRefreshConfirmation}
        onClose={() => {
          setShowRefreshConfirmation(false);
        }}
        onContinue={() => {
          handlePushRefresh();
        }}
        content="This will update the content and refresh the stream for all your viewers. Please ensure the page is saved if you made any changes to the content or the stream. Click CONTINUE to refresh your viewer's content."
        closeText="Go back"
        continueText="Continue"
      />

      <AlertModal
        open={discardOpen}
        onClose={handleDiscardAlertClose}
        onContinue={handleDiscardAlertContinue}
        content="Are you sure you want to discard your changes?"
        closeText="No"
        continueText="Yes"
      />

      <AlertModal
        open={removeLogoErrorOpen}
        onClose={handleRemoveLogoErrorClose}
        onContinue={handleRemoveLogoErrorContinue}
        content="The remove logo option is available for events on a Pro package. Please upgrade to continue."
        closeText="Close"
        continueText="Upgrade Now"
      />

      <div className="design">
        <div className="top-button-bar pt-5">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {event.package.PackageType.type === "free" ? (
              <button
                className="Button1"
                onClick={handleRemoveLogoError}
                style={{ margin: "12px 12px 0px 0px" }}
              >
                Remove Eventscape Logo
              </button>
            ) : null}
            <Link
              style={{ display: "flex" }}
              to={() =>
                "/preview/" +
                event.id +
                "/" +
                (page == pageNames.REGISTRATION
                  ? event.RegPageModelId
                  : event.EventPageModelId)
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton label="View as Guest" icon="visibility" />
            </Link>
            <IconButton
              label="Edit Background"
              icon="background"
              onClick={handleClickEditBackground}
            />
            <div style={{ display: "flex", position: "relative" }}>
              <IconButton
                label={
                  <span
                    style={{
                      display: "flex",
                      alignContent: "flex-end",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <span>Advanced</span>
                    <ExpandMoreIcon
                      style={{ height: "18px", margin: "0px -8px 0px -4px" }}
                    />
                  </span>
                }
                icon="code"
                onClick={handleClickAdvanced}
              />
              {showAdvancedOptions ? (
                <>
                  {/* The div below allows the user to click anywhere to hide the advanced options */}
                  <div
                    style={{
                      position: "fixed",
                      height: "100%",
                      width: "100%",
                      top: 0,
                      left: 0,
                      zIndex: 9999,
                    }}
                    onClick={() => setShowAdvancedOptions(false)}
                  />
                  <div className="advanced-options-container">
                    <Tooltip title="Use this function if you switch your stream, update page content, or need to force a refresh on your viewers page.">
                      <div
                        className="advanced-option"
                        onClick={handleClickRefresh}
                      >
                        <IconButton
                          label="Refresh Live Content"
                          icon="refresh"
                          horizontal
                        />
                      </div>
                    </Tooltip>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          {saveLoading ? (
            <div style={{ marginLeft: "auto", marginRight: "15px" }}>
              <FoldingCube />
            </div>
          ) : (
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              {model.isUnsaved ? (
                <>
                  <IconButton
                    label="Discard Changes"
                    icon="cancel"
                    onClick={() => setDiscardOpen(true)}
                  />

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
        <div
          id="designBoard"
          style={{ position: "relative" }}
          onMouseLeave={handleMouseLeave}
        >
          <div
            style={{
              position: "absolute",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className="page-background"
              style={{
                backgroundImage: `url(${model.backgroundImage})`,
                boxShadow: `inset 0 0 0 10000px ${model.backgroundColor}`,
                filter: `blur(${model.backgroundBlur}px)`,
              }}
            ></div>
          </div>

          <div>
            {event.package.PackageType.type === "free" ? <BrandingTop /> : null}
            <div className="section-container">
              {model.sections.length === 0
                ? null
                : model.sections.map(function (section, index) {
                    return (
                      <div key={section.id} className="section-block">
                        <PageSectionEditor
                          section={section}
                          sectionIndex={index}
                          isHovering={isHovering}
                          setIsHovering={setIsHovering}
                        />
                      </div>
                    );
                  })}
              <BrandingBottom />
            </div>
          </div>
        </div>
      </div>
      {/*Background Image Modal. */}

      <Modal1
        open={openBackgroundImage}
        onClose={handleCloseBackgroundSettings}
        isSideModal={true}
        content={
          <BackgroundImageSelector
            isPrimaryBg={true}
            handleClose={handleCloseBackgroundSettings}
          />
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(withRouter(PageEditor));
