import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  bottomBar: {
    position: "fixed",
    bottom: 0,
    right: 0,
    zIndex: 9999,
    display: "flex",
  },
  bottomTab: {
    width: "220px",
    padding: "10px",
    backgroundColor: "#b0281c",
    color: "#ffffff",
    fontSize: "14px",
    margin: "0px 6px",
  },
}));

const BottomBar = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.bottomBar}>
      <div className={classes.bottomTab}>Chat</div>
      <div className={classes.bottomTab}>Questions</div>
      <div className={classes.bottomTab}>Polling</div>
    </div>
  );
};

export default BottomBar;
