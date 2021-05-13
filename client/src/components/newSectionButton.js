import React, { useState } from "react";
import { connect } from "react-redux";

import * as actions from "../actions";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "600px",
  },
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
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  gridSelectors: {
    margin: "0px 1% 20px",
    minWidth: "30%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const NewSectionButton = ({ openSectionPicker }) => {
  return (
    <div>
      <div className="addSectionContainer">
        <Tooltip title="Add Design Block">
          <button className="addSection" onClick={openSectionPicker}>
            ADD DESIGN BLOCK
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(NewSectionButton);
