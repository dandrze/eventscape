import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Tooltip from "@material-ui/core/Tooltip";
import Cancel from "../icons/cancel.svg";

const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: "0px",
    },
}));

export default function Modal1(props) {
    const classes = useStyles();

    const {
        onClose,
        open,
        content,
    } = props;

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
                }}
                disableAutoFocus={true}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
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
                            <div style={{ overflowY: "scroll", overflowX: "scroll", maxHeight: "90vh", maxWidth: "95vw" }}>
                            <div style={{ padding: "1.5% 60px 60px 60px" }}>
                                {content}
                            </div>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}