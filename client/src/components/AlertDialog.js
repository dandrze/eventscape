import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function AlertDialog(props) {
	const { onClose, onContinue, open } = props;

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
						You have unsaved changes, are you sure you want to proceed?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Go Back
					</Button>
					<Button onClick={handleContinue} color="primary" autoFocus>
						Continue
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
