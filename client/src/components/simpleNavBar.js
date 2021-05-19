import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

// Icons:
import EventscapeLogo from "../icons/eventscape-logo-black.svg";

/* colour palette */
const MenuText = "#EAEAEA";
const MenuBackground = "white";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
  },
  appBar: {
    backgroundColor: MenuBackground,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    //padding: theme.spacing(3),
    padding: "0px",
    margin: "125px 0px",
    display: "flex",
    alignItems: "center",
  },
}));

export default function SimpleNavBar(props) {
  const classes = useStyles();
  const content = props.content;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <img
            className="eventscape-logo"
            src={EventscapeLogo}
            alt="eventscape-logo"
            height="35px"
          ></img>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>{content}</main>
    </div>
  );
}
