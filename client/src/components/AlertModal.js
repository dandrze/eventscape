import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";

export default function AlertModal(props) {
  const [input, setInput] = useState("");

  const handleChangeInput = (event) => {
    setInput(event.target.value);
  };
  const {
    onClose,
    onContinue,
    open,
    content,
    closeText,
    continueText,
    textInputLabel,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const handleContinue = () => {
    onContinue(input);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        {textInputLabel ? (
          <TextField
            autoFocus
            margin="dense"
            id="input"
            label={textInputLabel}
            type="standard"
            value={input}
            onChange={handleChangeInput}
            variant="outlined"
            style={{ margin: "0px 30px" }}
          />
        ) : null}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {closeText || "Close"}
          </Button>
          {continueText ? (
            <Button onClick={handleContinue} color="primary">
              {continueText}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
