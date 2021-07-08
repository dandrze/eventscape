import React, { useState } from "react";
import {
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";

export default function AlertModal({
  onClose,
  onContinue,
  open,
  content,
  closeText,
  continueText,
  textInputLabel,
  inputAdornment = null,
  errorText = null,
}) {
  const [input, setInput] = useState("");

  const handleChangeInput = (event) => {
    setInput(event.target.value);
  };

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
            helperText={errorText}
            error={errorText ? true : false}
            variant="outlined"
            style={{ margin: "0px 30px" }}
            InputProps={
              inputAdornment
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        {inputAdornment}
                      </InputAdornment>
                    ),
                  }
                : null
            }
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
