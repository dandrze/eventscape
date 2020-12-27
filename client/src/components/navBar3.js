import React from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import SettingsIcon from "@material-ui/icons/Settings";

import "./navBar3.css";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import PenIcon from "../icons/pen.svg";
import EnvelopeIcon from "../icons/envelope.svg";
import NotepadIcon from "../icons/notepad.svg";
import GraphIcon from "../icons/graph.svg";
import ChatIcon from "../icons/chat.svg";
import EventscapeLogo from "../icons/eventscape-logo-navbar.png";

import Internet_icon from "../icons/internet.svg";
import swap_icon from "../icons/swap.svg";
import plus_icon from "../icons/plus.svg";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

import * as actions from "../actions";
import AlertModal from "./AlertModal";
import { pageNames } from "../model/enums";

/*color palette*/
const MenuText = "#EAEAEA";
const MenuBackground = "#2F2F2F";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: MenuBackground,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
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
    margin: "0px",
  },
  currentEvent: {
    display: "block",
    color: MenuText,
    fontSize: "18px",
    fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontWeight: "300",
  },
  addEvent: {
    marginLeft: "auto",
  },
  profile: {
    marginLeft: "0px",
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: "14px",
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  highlight: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function NavBar3(props) {
  const displaySideNav = props.displaySideNav;
  const content = props.content;
  const open = props.settings.sideDrawerOpen;
  const highlight = props.highlight;

  let history = useHistory();

  const classes = useStyles();
  const theme = useTheme();
  const [navAlertOpen, setNavAlertOpen] = React.useState(false);
  const [target, setTarget] = React.useState("");

  const handlePageChange = (pageName) => {
    // if the user is currently on the design page, and they want to navigate to the other page editor with unsaved changes, display the confirmation alert
    if (history.location.pathname == "/design" && props.model.isUnsaved) {
      setTarget(pageName);
      setNavAlertOpen(true);
    } else {
      changePageEditor(pageName);
      history.push("/design");
    }
  };

  const handleNavAlertClose = () => {
    setNavAlertOpen(false);
  };

  const changePageEditor = (pageName) => {
    props.changePageEditor(pageName);
  };

  const handleDrawerOpen = () => {
    props.setSideDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    props.setSideDrawerOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /*Design drop down*/
  const [anchorElDesign, setAnchorElDesign] = React.useState(null);

  const handleClickDesign = (event) => {
    setAnchorElDesign(event.currentTarget);
  };

  const handleCloseDesign = () => {
    setAnchorElDesign(null);
  };

  const handleGoToLiveSite = () => {
    window.open(`https://${props.event.link}.eventscape.io`);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AlertModal
        open={navAlertOpen}
        onClose={handleNavAlertClose}
        onContinue={() => {
          handleNavAlertClose();
          changePageEditor(target);
        }}
        text="You have unsaved changes, are you sure you want to proceed?"
        closeText="Go back"
        continueText="Continue"
      />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {displaySideNav === "true" && (
            <Tooltip title="Expand Menu">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="eventscape Home Page">
            <Button>
              <Link to="/">
                <img
                  className="eventscape-logo"
                  src={EventscapeLogo}
                  alt="eventscape-logo"
                  height="18px"
                ></img>
              </Link>
            </Button>
          </Tooltip>

          <Tooltip title="View Live Website">
            <Button onClick={handleGoToLiveSite}>
              <img
                className="profile"
                src={Internet_icon}
                alt="user"
                height="30px"
              ></img>
            </Button>
          </Tooltip>

          <Tooltip title="Change Event">
            <Link to="/my-events">
              <div className="current_event_container">
                <Typography
                  className={classes.currentEvent}
                  variant="h6"
                  noWrap
                >
                  {props.event.title}
                </Typography>
                <img
                  className="swap_icon"
                  src={swap_icon}
                  alt="swap_icon"
                  height="30px"
                ></img>
              </div>
            </Link>
          </Tooltip>

          <Tooltip title="Create a new event">
            <Button className={classes.addEvent} href="/event-details">
              <img
                className="profile"
                src={plus_icon}
                alt="user"
                height="30px"
              ></img>
            </Button>
          </Tooltip>

          <Tooltip title="Profile Settings">
            <Button
              className={classes.profile}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <div className={classes.root}>
                <Avatar className={`${classes.purple} ${classes.large}`}>
                  {props.user.first_name[0] + " " + props.user.last_name[0]}
                </Avatar>
              </div>
            </Button>
          </Tooltip>

          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem>
              <ListItemIcon>
                <div className={classes.root}>
                  <Avatar className={`${classes.purple} ${classes.large}`}>
                    {props.user.first_name[0] + " " + props.user.last_name[0]}
                  </Avatar>
                </div>
              </ListItemIcon>
              <ListItemText
                primary={props.user.first_name + " " + props.user.last_name}
                secondary={props.user.email}
              />
            </StyledMenuItem>

            <Divider />

            <StyledMenuItem>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Account Settings" />
            </StyledMenuItem>

            <StyledMenuItem>
              <ListItemIcon>
                <SwapHorizIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Switch Account" />
            </StyledMenuItem>
            <a href="/auth/logout">
              <StyledMenuItem>
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </StyledMenuItem>
            </a>
          </StyledMenu>
        </Toolbar>
      </AppBar>
      {displaySideNav === "true" && (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem
              button
              key="design"
              component="a"
              onClick={handleClickDesign}
              className={clsx({
                [classes.highlight]: highlight === "design",
              })}
            >
              <Tooltip title="Design">
                <ListItemIcon>
                  <img src={PenIcon} height="20px"></img>
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Design" />
            </ListItem>
            <Link to="/communication">
              <ListItem
                button
                key="communicate"
                className={clsx({
                  [classes.highlight]: highlight === "communication",
                })}
              >
                <Tooltip title="Communicate">
                  <ListItemIcon>
                    <img src={EnvelopeIcon} height="20px"></img>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Communicate" />
              </ListItem>
            </Link>
            <Link to="/registrations">
              <ListItem
                button
                key="registrations"
                className={clsx({
                  [classes.highlight]: highlight === "registrations",
                })}
              >
                <Tooltip title="Registrations">
                  <ListItemIcon>
                    <img src={NotepadIcon} height="20px"></img>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Registrations" />
              </ListItem>
            </Link>
            <Link to="./analytics">
              <ListItem
                button
                key="analytics"
                className={clsx({
                  [classes.highlight]: highlight === "analytics",
                })}
              >
                <Tooltip title="Analytics">
                  <ListItemIcon>
                    <img src={GraphIcon} height="20px"></img>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Analytics" />
              </ListItem>
            </Link>
            <Link to="./messaging">
              <ListItem
                button
                key="messaging"
                className={clsx({
                  [classes.highlight]: highlight === "messaging",
                })}
              >
                <Tooltip title="Messaging">
                  <ListItemIcon>
                    <img src={ChatIcon} height="20px"></img>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Messaging" />
              </ListItem>
            </Link>
          </List>
          <Menu
            id="simple-menu"
            anchorEl={anchorElDesign}
            keepMounted
            open={Boolean(anchorElDesign)}
            onClose={handleCloseDesign}
          >
            <MenuItem
              onClick={() => {
                handleCloseDesign();
                handlePageChange("registration");
              }}
            >
              Registration Page
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseDesign();
                handlePageChange("event");
              }}
            >
              Event Page
            </MenuItem>
            <Link to="./website-settings">
              <MenuItem onClick={handleCloseDesign}>Website Settings</MenuItem>
            </Link>
          </Menu>
        </Drawer>
      )}
      <main className={classes.content}>
        <div className={classes.toolbar}></div>
        {content}
        <div className="force-width">
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          -
        </div>
      </main>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    event: state.event,
    model: state.model,
    settings: state.settings,
    user: state.user,
  };
};

export default connect(mapStateToProps, actions)(NavBar3);
