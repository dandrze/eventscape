import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";

/* colapsible side nav experimenting, move later */
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

import "./navBar3.css";

import * as actions from "../actions";

/* Icons top bar */
import EventscapeLogo from "../icons/eventscape-logo-eaeaea.svg";
import Internet_icon from "../icons/internet.svg";
import plus_icon from "../icons/plus.svg";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListIcon from "@material-ui/icons/List";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import SettingsIcon from "@material-ui/icons/Settings";

/* Icons side nav */
import ListMinimalIcon from "../icons/list-minimal.svg";
import PenIcon from "../icons/pen.svg";
import EnvelopeIcon from "../icons/envelope.svg";
import NotepadIcon from "../icons/notepad.svg";
import GraphIcon from "../icons/graph.svg";
import ChatIcon from "../icons/chat.svg";
import InvoiceIcon from "../icons/invoice3.svg";
import CharChartIcon from "../icons/bar-chart.svg";
import TeamIcon from "../icons/team.svg";
import DashboardIcon from "../icons/dashboard.svg";

/* Icons side nav account */
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AccountIcon from "../icons/account.svg";

import { statusOptions } from "../model/enums";

import DraftModeMessage from "./DraftModeMessage";

/* colour palette */
const MenuText = "#EAEAEA";
const MenuBackground = "#2F2F2F";

const eventSpecificPages = [
  "license",
  "messaging",
  "analytics",
  "polls",
  "registrations",
  "permissions",
  "communication",
  "design",
  "event-details",
  "dashboard",
];

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
    padding: "24px 0px 0px",
    margin: "64px 0px 0px 0px",
    width: "calc(100vw - 240px)",
    overflowY: "scroll", // Added to fix froala cursor jumping bug
    height: "calc(100vh - 64px)", // Added to fix froala cursor jumping bug
    position: "relative",
  },
  fullWidth: {
    flexGrow: 1,
    //padding: theme.spacing(3),
    padding: "24px 0px 0px",
    margin: "64px 0px 0px 0px",
    overflowY: "scroll", // Added to fix froala cursor jumping bug
    height: "calc(100vh - 64px)", // Added to fix froala cursor jumping bug
  },
  currentEvent: {
    display: "block",
    color: MenuText,
    fontSize: "18px",
    fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontWeight: "300",
  },

  profile: {
    marginLeft: "auto",
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
  greyWhite: {
    color: MenuBackground,
    backgroundColor: "#EAEAEA",
  },
  highlight: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    borderLeft: "solid 4px var(--main-color)",
    paddingLeft: "12px", //16px minus border width
    color: "var(--main-color)",
  },
  nested: {
    paddingLeft: "90px",
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

const StyledMenuItemNoButton = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: "inherit",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "inherit",
      },
      cursor: "inherit",
    },
  },
}))(MenuItem);

function NavBar3(props) {
  const displaySideNav = props.displaySideNav;
  const displaySideNavAccount = props.displaySideNavAccount;
  const content = props.content;
  const openBlocked = props.openBlocked;
  const open = props.settings.sideDrawerOpen && !openBlocked;
  const highlight = props.highlight;
  const [openDesignNested, setOpenDesignNested] = useState(
    highlight === "design"
  );
  const [drawerPreviouslyOpen, setDrawerPreviouslyOpen] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEventList = async () => {
      const eventList = await props.fetchEventList();

      setEvents(eventList);
    };

    fetchEventList();
  }, []);

  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerOpen = () => {
    props.setSideDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    props.setSideDrawerOpen(false);
    if (openDesignNested === true) {
      setOpenDesignNested(false);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickDesignNested = () => {
    setOpenDesignNested(!openDesignNested);
    if (open === true) {
      setDrawerPreviouslyOpen(true);
    } else {
      setDrawerPreviouslyOpen(false);
      handleDrawerOpen();
    }
  };

  const handleClickNestedItem = () => {
    setOpenDesignNested(false);
    if (drawerPreviouslyOpen === false) {
      handleDrawerClose();
    }
  };

  const handleChangeEvent = async (event) => {
    if (event.target.value === "all") {
      return props.history.push("/my-events");
    }
    props.setCurrentEvent(event.target.value);
    const res = await props.fetchEvent();
    window.location.reload();
  };

  const handleGoToLiveSite = () => {
    switch (process.env.NODE_ENV) {
      case "development":
        return window.open(`http://${props.event.link}.localhost:3000`);
      case "staging":
        return window.open(`http://${props.event.link}.eventscape.ca`);
      case "production":
        return window.open(`https://${props.event.link}.eventscape.io`);
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {(displaySideNav === "true" || displaySideNavAccount === "true") && (
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
                  height="35px"
                ></img>
              </Link>
            </Button>
          </Tooltip>

          {displaySideNav === "true" && (
            <>
              <Tooltip title="View Live Website">
                <Button
                  onClick={handleGoToLiveSite}
                  className="vertical-button"
                >
                  <img
                    className="profile"
                    src={Internet_icon}
                    alt="user"
                    height="30px"
                  ></img>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "0.6rem",
                      textTransform: "none",
                      marginTop: "3px",
                    }}
                  >
                    View Live
                  </div>
                </Button>
              </Tooltip>
              <Tooltip
                title={
                  <div>
                    Create a new event. <br />
                    <br />
                    TIP: You may duplicate an existing event by clicking on the
                    Current Event, then Manage Events, then the plus icon next
                    to your event in the table.
                  </div>
                }
              >
                <Button
                  href="/create-event"
                  className="vertical-button"
                  tooltip="test"
                >
                  <img
                    className="profile"
                    src={plus_icon}
                    alt="user"
                    height="30px"
                  ></img>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "0.6rem",
                      textTransform: "none",
                      marginTop: "3px",
                      width: "60px",
                    }}
                  >
                    Create Event
                  </div>
                </Button>
              </Tooltip>

              <FormControl
                variant="outlined"
                style={{ margin: "5px auto 5px 20px" }}
              >
                {/* Category */}
                <InputLabel
                  id="event-select-label"
                  className="mui-select-css-fix-dark"
                >
                  Current Event
                </InputLabel>
                <Select
                  id="event-select"
                  labelId="event-select-label"
                  variant="outlined"
                  className="white-dropdown align-left"
                  value={props.event.id}
                  onChange={handleChangeEvent}
                  style={{
                    minWidth: "300px",
                  }}
                >
                  <MenuItem value={"all"}>Manage Events</MenuItem>
                  <Divider style={{ margin: "0px 0px 10px" }} />
                  <div
                    style={{
                      padding: "0px 15px 5px",
                      color: "grey",
                      fontStyle: "italic",
                    }}
                  >
                    Upcoming Events
                  </div>
                  {events.map((event) => {
                    const today = new Date();

                    // If the event from the event list is in the future and not deleted,
                    // or if the event is the currently editting event, display it in the list (in case the user is editting a past event)
                    if (
                      (new Date(event.startDate) > today &&
                        event.status != statusOptions.DELETED) ||
                      event.id === props.event.id
                    ) {
                      return (
                        <MenuItem value={event.id}>{event.title}</MenuItem>
                      );
                    }
                  })}
                </Select>
              </FormControl>
            </>
          )}

          <Tooltip title="Account">
            <Button
              className={classes.profile}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <div className={classes.root}>
                <Avatar className={`${classes.greyWhite} ${classes.large}`}>
                  {props.user.firstName[0]}
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
            <StyledMenuItemNoButton>
              <ListItemIcon>
                <div className={classes.root}>
                  <Avatar className={`${classes.greyWhite} ${classes.large}`}>
                    {props.user.firstName[0]}
                  </Avatar>
                </div>
              </ListItemIcon>
              <ListItemText
                primary={props.user.firstName}
                secondary={props.user.emailAddress}
              />
            </StyledMenuItemNoButton>

            <Divider />

            {displaySideNav === "false" && props.event.title && (
              <Link to="/">
                <StyledMenuItem>
                  <ListItemIcon>
                    <ArrowBackIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={"Back to " + props.event.title} />
                </StyledMenuItem>
              </Link>
            )}

            <Link to="/my-events">
              <StyledMenuItem>
                <ListItemIcon>
                  <ListIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Events" />
              </StyledMenuItem>
            </Link>

            <Link to="/account-settings-contact">
              <StyledMenuItem>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Account Settings" />
              </StyledMenuItem>
            </Link>
            <a href="/auth/logout?target=login">
              <StyledMenuItem>
                <ListItemIcon>
                  <SwapHorizIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Switch Account" />
              </StyledMenuItem>
            </a>
            <a href="/auth/logout?target=">
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
            <Link to="/">
              <ListItem
                button
                key="dashboard"
                className={clsx({
                  [classes.highlight]: highlight === "dashboard",
                })}
              >
                <Tooltip title="Dashboard">
                  <ListItemIcon>
                    <img src={DashboardIcon} height="20px"></img>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>
            {props.event.permissions?.eventDetails ? (
              <Link to="/event-details">
                <ListItem
                  button
                  key="event-details"
                  className={clsx({
                    [classes.highlight]: highlight === "event-details",
                  })}
                >
                  <Tooltip title="Event Details">
                    <ListItemIcon>
                      <img src={ListMinimalIcon} height="20px"></img>
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Event Details" />
                </ListItem>
              </Link>
            ) : null}

            {/* Design */}
            {props.event.permissions?.design ? (
              props.event.registrationRequired ? (
                <>
                  <ListItem
                    button
                    onClick={handleClickDesignNested}
                    className={clsx({
                      [classes.highlight]: highlight === "design",
                    })}
                  >
                    <ListItemIcon>
                      <img src={PenIcon} height="20px"></img>
                    </ListItemIcon>
                    <ListItemText primary="Design" />
                    {openDesignNested ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  {/* Design Nested Menu */}
                  <Collapse in={openDesignNested} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {/* Registration Page */}
                      <Link to="/design/registration">
                        <ListItem
                          button
                          className={classes.nested}
                          onClick={handleClickNestedItem}
                        >
                          <ListItemText secondary="Registration Page" />
                        </ListItem>
                      </Link>

                      {/* Event Page */}
                      <Link to="/design/event">
                        <ListItem
                          button
                          className={classes.nested}
                          onClick={handleClickNestedItem}
                        >
                          <ListItemText secondary="Event Page" />
                        </ListItem>
                      </Link>
                    </List>
                  </Collapse>{" "}
                </>
              ) : (
                <Link to="/design">
                  <ListItem
                    button
                    key="design"
                    className={clsx({
                      [classes.highlight]: highlight === "design",
                    })}
                  >
                    <Tooltip title="Design">
                      <ListItemIcon>
                        <img src={GraphIcon} height="20px"></img>
                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary="Design" />
                  </ListItem>
                </Link>
              )
            ) : null}
            {props.event.permissions?.communication &&
            props.event.registrationRequired ? (
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
            ) : null}
            {props.event.permissions?.role === "owner" ? (
              <Link to="/permissions">
                <ListItem
                  button
                  key="permissions"
                  className={clsx({
                    [classes.highlight]: highlight === "permissions",
                  })}
                >
                  <Tooltip title="Assign Permissions to Team">
                    <ListItemIcon>
                      <img src={TeamIcon} height="20px"></img>
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Collaborate" />
                </ListItem>
              </Link>
            ) : null}
            {props.event.registrationRequired &&
            props.event.permissions?.registration ? (
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
            ) : null}
            {props.event.permissions?.polls ? (
              <Link to="/polls">
                <ListItem
                  button
                  key="polls"
                  className={clsx({
                    [classes.highlight]: highlight === "polls",
                  })}
                >
                  <Tooltip title="Polls">
                    <ListItemIcon>
                      <img src={CharChartIcon} height="25px"></img>
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Polls" />
                </ListItem>
              </Link>
            ) : null}
            {props.event.permissions?.analytics ? (
              <Link to="/analytics">
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
            ) : null}
            {props.event.permissions?.messaging ? (
              <Link to="/messaging">
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
            ) : null}
            {props.event.permissions?.role === "owner" ? (
              <Link to="/license">
                <ListItem
                  button
                  key="license"
                  className={clsx({
                    [classes.highlight]: highlight === "license",
                  })}
                >
                  <Tooltip title="License">
                    <ListItemIcon>
                      <img src={InvoiceIcon} height="20px"></img>
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="License" />
                </ListItem>
              </Link>
            ) : null}
          </List>
        </Drawer>
      )}

      {/* Side Nav for Account Settings */}
      {displaySideNavAccount === "true" && (
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
            {/* Contact */}
            <Link to="/account-settings-contact">
              <ListItem
                button
                key="contact"
                component="a"
                className={clsx({
                  [classes.highlight]: highlight === "contact",
                })}
              >
                <Tooltip title="Account">
                  <ListItemIcon>
                    <img src={AccountIcon} height="20px"></img>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Contact" />
              </ListItem>
            </Link>

            {/* Billing and Payments */}
            {/*<Link to="/account-settings-payments">
              <ListItem
                button
                key="payments"
                className={clsx({
                  [classes.highlight]: highlight === "payments",
                })}
              >
                <Tooltip title="Billing and Payments">
                  <ListItemIcon>
                    <img src={CreditCardIcon} height="20px"></img>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Billing and Payments" />
              </ListItem>
            </Link>*/}
          </List>
        </Drawer>
      )}
      <div className={props.fullWidth ? classes.fullWidth : classes.content}>
        {/*If there is no license, show the draft mode bar if the user is on an event specific page*/}
        {!props.event.License && eventSpecificPages.includes(highlight) ? (
          <DraftModeMessage
            inApp={true}
            isAdmin={props.event.permissions?.role === "owner"}
          />
        ) : null}
        {content}
      </div>
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

export default connect(mapStateToProps, actions)(withRouter(NavBar3));
