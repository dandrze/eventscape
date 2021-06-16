import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Tooltip from "@material-ui/core/Tooltip";
import Cancel from "../icons/cancel.svg";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
  primaryColor: {
    color: "#b0281c",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #c7c7c7",
    boxShadow: theme.shadows[5],
    padding: "0px",
  },

  sideModal: {
    position: "absolute",
    right: 0,
    bottom: "100px",
    padding: "18px",
  },
}));

export default function Modal1({ onClose, open, content, title, isSideModal }) {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          invisible: isSideModal,
        }}
        disableAutoFocus={true}
      >
        {isSideModal ? (
          <Slide direction="left" in={open} mountOnEnter unmountOnExit>
            <div className={`${classes.paper} ${classes.sideModal}`}>
              <div>
                <div
                  style={{
                    maxHeight: "90vh",
                    maxWidth: "95vw",
                  }}
                >
                  <div>
                    {title ? (
                      <h2 className={classes.primaryColor}>{title}</h2>
                    ) : null}
                    <div>{content}</div>
                  </div>
                </div>
              </div>
            </div>
          </Slide>
        ) : (
          <Fade in={open}>
            <div className={`${classes.paper} `}>
              <div>
                <div className="cancel-bar">
                  <Tooltip title="Close">
                    <img
                      src={Cancel}
                      className="cancel-bar-icon"
                      onClick={handleClose}
                    ></img>
                  </Tooltip>
                </div>

                <div
                  style={{
                    overflowY: "scroll",
                    overflowX: "scroll",
                    maxHeight: "90vh",
                    maxWidth: "95vw",
                    padding: "18px 60px",
                  }}
                >
                  <div>
                    {title ? (
                      <h2 className={classes.primaryColor}>{title}</h2>
                    ) : null}
                    <div>{content}</div>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        )}
      </Modal>
    </div>
  );
}
