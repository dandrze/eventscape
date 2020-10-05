import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import PenIcon from './pen.svg';
import EnvelopeIcon from './envelope.svg';
import NotepadIcon from './notepad.svg';
import GraphIcon from './graph.svg';
import ChatIcon from './chat.svg';


import logo from './triangular-logo.svg';
import Internet_icon from './internet.svg';
import plus_icon from './plus.svg';
import user_icon from './user.svg';
import Tooltip from "@material-ui/core/Tooltip";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

/*color palette*/
const MenuText = '#EAEAEA'
const MenuBackground = '#2F2F2F'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: MenuBackground,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    //padding: theme.spacing(3),
    padding: '0px',
    margin: '0px',
  },
  currentEvent: {
    display: 'block',
    color: MenuText,
    fontSize: '18px',
    fontFamily: 'San Francisco, Helvetica, Arial, sans-serif',
  },
  addEvent: {
    marginLeft: 'auto',
  },
  profile: {
    marginLeft: '0px',
  },
}));

export default function NavBar3(props) {
  const displaySideNav = props.displaySideNav;
  const content = props.content;
  
    const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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
        {displaySideNav === "true" &&
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
            }
          <Tooltip title="View Live Website">
            <Button href="/">
              <img className='profile' src={Internet_icon} alt="user" height="30px"></img>
            </Button>
          </Tooltip>
          
          <Tooltip title="Change Event">
            <a href="/My_Events">
            <Typography className={classes.currentEvent} variant="h6" noWrap>
              Current Event
            </Typography>
            </a>
          </Tooltip>

          <Tooltip title="Create a new event">
            <Button className={classes.addEvent} href="/Event_Details">
              <img className='profile' src={plus_icon} alt="user" height="30px"></img>
            </Button>
          </Tooltip>

          <Tooltip title="Profile Settings">
            <Button className={classes.profile} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <img className='profile' src={user_icon} alt="user" height="30px"></img>
            </Button>
          </Tooltip>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {displaySideNav === "true" &&
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
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>

          <ListItem button key="design" component="a" onClick={handleClickDesign}>
              <Tooltip title="Design">
                <ListItemIcon><img src={PenIcon} height='20px'></img></ListItemIcon>
              </Tooltip>
              <ListItemText primary="Design" />
          </ListItem>

          <ListItem button key="communicate" component="a" href="/Communication">
              <Tooltip title="Communicate">
                <ListItemIcon><img src={EnvelopeIcon} height='20px'></img></ListItemIcon>
              </Tooltip>
              <ListItemText primary="Communicate" />
          </ListItem>

          <ListItem button key="registrations" component="a" href="/Registrations">
              <Tooltip title="Registrations">
                <ListItemIcon><img src={NotepadIcon} height='20px'></img></ListItemIcon>
              </Tooltip>
              <ListItemText primary="Registrations" />
          </ListItem>

          <Link to="./Analytics">
          <ListItem button key="analytics">
              <Tooltip title="Analytics">
                <ListItemIcon><img src={GraphIcon} height='20px'></img></ListItemIcon>
              </Tooltip>
              <ListItemText primary="Analytics" />
          </ListItem>
          </Link>

          <ListItem button key="messaging">
              <Tooltip title="Messaging">
                <ListItemIcon><img src={ChatIcon} height='20px'></img></ListItemIcon>
              </Tooltip>
              <ListItemText primary="Messaging" />
          </ListItem>

        </List>
        <Menu
            id="simple-menu"
            anchorEl={anchorElDesign}
            keepMounted
            open={Boolean(anchorElDesign)}
            onClose={handleCloseDesign}
          >
            <Link to="./Design"><MenuItem onClick={handleCloseDesign}>Registration Page</MenuItem></Link>
            <MenuItem onClick={handleCloseDesign}>Event Page</MenuItem>
            <MenuItem onClick={handleCloseDesign}>Website Settings</MenuItem>
          </Menu>
      </Drawer>
        }
      <main className={classes.content}>
        <div className={classes.toolbar}></div>
        {content}
      </main>
    </div>
  );
}
