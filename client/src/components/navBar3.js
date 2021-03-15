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
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

/* colapsible side nav experimenting, move later */
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

import "./navBar3.css";

import * as actions from "../actions";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

/* Icons top bar */
import EventscapeLogo from "../icons/eventscape-logo-eaeaea.svg";
import Internet_icon from "../icons/internet.svg";
import swap_icon from "../icons/swap.svg";
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
import PollIcon from "../icons/poll-1.svg";
import CharChartIcon from "../icons/bar-chart.svg";

/* Icons side nav account */
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AccountIcon from "../icons/account.svg";
import KeyIcon from "../icons/key.svg";
import CreditCardIcon from "../icons/credit-card.svg";

/* colour palette */
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
    margin: "100px 0px 0px 0px",
    width: "calc(100vw - 240px)",
    overflowY: "scroll", // Added to fix froala cursor jumping bug
    height: "100vh", // Added to fix froala cursor jumping bug
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
  const [openDesignNested, setOpenDesignNested] = React.useState(false);
  const [drawerPreviouslyOpen, setDrawerPreviouslyOpen] = React.useState(true);

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

  const [anchorEl, setAnchorEl] = React.useState(null);

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
            </>
          )}

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

          <Tooltip title="Account">
            <Button
              className={classes.profile}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <div className={classes.root}>
                <Avatar className={`${classes.greyWhite} ${classes.large}`}>
                  {props.user.firstName[0] + props.user.lastName[0]}
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
                    {props.user.firstName[0] + props.user.lastName[0]}
                  </Avatar>
                </div>
              </ListItemIcon>
              <ListItemText
                primary={props.user.firstName + " " + props.user.lastName}
                secondary={props.user.emailAddress}
              />
            </StyledMenuItemNoButton>

            <Divider />

            {displaySideNav === "false" && (
              <Link to="/design/event">
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
            <Link to="/permissions">
              <StyledMenuItem>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Collaborators" />
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
            <Link to="/website-settings">
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

            {/* Design */}
            {props.event.registrationRequired ? (
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
            )}

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
            {props.event.registrationRequired ? (
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

            {/* Password */}
            <Link to="/account-settings-password">
              <ListItem
                button
                key="password"
                component="a"
                className={clsx({
                  [classes.highlight]: highlight === "password",
                })}
              >
                <Tooltip title="Password">
                  <ListItemIcon>
                    <img src={KeyIcon} height="20px"></img>
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Password" />
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
      <div className={classes.content}>{content}</div>
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
