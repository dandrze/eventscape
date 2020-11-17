import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function AlertModal(props) {
	const { onClose, onContinue, open, text, closeText, continueText } = props;

	const handleClose = () => {
		onClose();
	};

	const handleContinue = () => {
		onContinue();
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
						{text}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						{closeText}
					</Button>
					<Button onClick={handleContinue} color="primary" autoFocus>
						{continueText}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
