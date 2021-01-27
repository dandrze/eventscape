import React, { useEffect } from "react";
import { connect } from "react-redux";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import SettingsIcon from "@material-ui/icons/Settings";
import "./designBlockToolbar.css";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import * as actions from "../actions";
import Tabs from "../components/Tabs";
import RoomTable from "./room-table";
import { fetchChatRooms } from "../actions";
import Modal1 from "./Modal1";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: "600px",
  },
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  sectionTooltip: {
    position: "absolute",
    top: "-30px",
    background: "#7b7b7b",
    border: "1px solid #777777",
    padding: "8px",
    fontSize: "12px",
    color: "#ffffff",
    borderRadius: "5px",
    opacity: "0.85",
  },
}));

function DesignBlockToolbar(props) {
  const classes = useStyles();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [openStreamSettings, setOpenStreamSettings] = React.useState(false);
  const [content, setContent] = React.useState("youtube-embed");
  const [youtubeLink, setYoutubeLink] = React.useState("");
  const [customHTML, setCustomHTML] = React.useState("");
  const [sectionTooltip, setSectionTooltip] = React.useState("");
  const [room, setRoom] = React.useState();
  const [rooms, setRooms] = React.useState([]);
  const [tabsEnabled, setTabsEnabled] = React.useState({
    chat: true,
    question: true,
  });

  const showStreamSettings =
    props.section.isReact && props.section.reactComponent.name == "StreamChat";

  // Updating the settings based on props
  // UseEffect mimicks OnComponentDidMount
  useEffect(() => {
    if (props.section.reactComponent) {
      setContent(props.section.reactComponent.props.content);
      setYoutubeLink(props.section.reactComponent.props.link);
      setCustomHTML(props.section.reactComponent.props.html);
      setRoom(props.section.reactComponent.props.chatRoom);
      if (props.section.reactComponent.props.tabsEnabled)
        setTabsEnabled(props.section.reactComponent.props.tabsEnabled);

      // set the section tooltip if it's a section that requires one
      if (props.section.isReact) {
        switch (props.section.reactComponent.name) {
          case "StreamChat":
            setSectionTooltip("Click the gears icon to add your stream");
            fetchChatRooms();
            break;
          case "RegistrationForm":
            setSectionTooltip(
              "Go to registration tab to edit the registration form"
            );
            break;
        }
      }
    }
  }, []);

  const fetchChatRooms = async () => {
    const chatRooms = await props.fetchChatRooms(props.event.id);
    setRooms(chatRooms.data);
  };

  const handleClickDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    props.deleteSection(props.sectionIndex, props.section);
  };

  // Stream Settings:
  const handleOpenStreamSettings = () => {
    setOpenStreamSettings(true);
  };

  const handleCloseStreamSettings = () => {
    setOpenStreamSettings(false);
  };

  const handleSaveStreamSettings = () => {
    setOpenStreamSettings(false);
    props.saveStreamSettings(props.sectionIndex, {
      content,
      link: youtubeLink,
      html: customHTML,
      chatRoom: room,
      tabsEnabled,
    });
  };

  const handleChangeContent = (event) => {
    setContent(event.target.value);
  };

  const handleChangeYoutubeLink = (event) => {
    // remove any whitespace
    setYoutubeLink(event.target.value.replace(/\s+/g, ""));
  };

  const handleChangeCustomHTML = (event) => {
    setCustomHTML(event.target.value);
  };

  const handleChangeRoom = (event) => {
    setRoom(event.target.value);
  };

  const handleClickMove = (offset) => {
    if (
      props.sectionIndex + offset >= 0 &&
      props.sectionIndex + offset <= props.maxIndex - 1
    ) {
      props.moveSection(props.sectionIndex, offset);
    }
  };

  const handleChangeTabsEnabled = (event) => {
    setTabsEnabled({
      ...tabsEnabled,
      [event.target.name]: event.target.checked,
    });
  };

  const { chat, question } = tabsEnabled;
  const tabsEnabledError = [chat, question].filter((v) => v).length < 1;

  return (
    <div>
      {/* Toolbar */}
      {(props.displayToolbar === true) &
      (openStreamSettings === false) &
      (deleteConfirmOpen === false) ? (
        <div className="toolbar_container">
          <Tooltip title="Move Up">
            <div
              className="design-block-toolbar-button"
              onClick={() => handleClickMove(-1)}
            >
              <KeyboardArrowUpIcon />
            </div>
          </Tooltip>
          <Tooltip title="Move Down">
            <div
              className="design-block-toolbar-button"
              onClick={() => handleClickMove(1)}
            >
              <KeyboardArrowDownIcon />
            </div>
          </Tooltip>
          <Tooltip title="Delete Design Block">
            <div
              className="design-block-toolbar-button"
              onClick={handleClickDelete}
            >
              <DeleteOutlined />
            </div>
          </Tooltip>
          {showStreamSettings ? (
            <>
              <Tooltip title="Stream Settings">
                <div
                  className="design-block-toolbar-button"
                  onClick={handleOpenStreamSettings}
                >
                  <SettingsIcon />
                </div>
              </Tooltip>
            </>
          ) : null}
          {sectionTooltip ? (
            <div className={classes.sectionTooltip}>{sectionTooltip}</div>
          ) : null}
        </div>
      ) : null}

      {/* Confirm Delete */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete design block?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleCloseDelete();
              handleConfirmDelete();
            }}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/*Stream Settings Modal: */}
      <Modal1
        open={openStreamSettings}
        onClose={handleCloseStreamSettings}
        content={
          <div>
            <h3>Settings</h3>
            <br></br>
            <Tabs>
              <div label="Stream">
                <div className="settings-container">
                  <div className={classes.root}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                        >
                          {/* Category */}
                          <InputLabel
                            id="content"
                            className="fix-mui-select-label"
                          >
                            Content
                          </InputLabel>
                          <Select
                            labelId="content"
                            id="content-select"
                            required="true"
                            value={content}
                            onChange={handleChangeContent}
                          >
                            <MenuItem value={"youtube-live"}>
                              Youtube Live
                            </MenuItem>
                            <MenuItem value={"custom-embed"}>
                              Custom HTML Embed (Advanced)
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        {content === "youtube-live" && (
                          <div>
                            <FormControl
                              variant="outlined"
                              className={classes.formControl}
                            >
                              <TextField
                                id="youtube-link"
                                label="Youtube Link"
                                variant="outlined"
                                value={youtubeLink}
                                onChange={handleChangeYoutubeLink}
                                placeholder="http://www.youtube.com"
                              />
                            </FormControl>
                            <p>
                              Need help? Click here for instructions on setting
                              up a YouTube Live stream.
                            </p>
                            <p>
                              Heads up! YouTube may take down any streams
                              containing copyrighted music.
                            </p>
                          </div>
                        )}
                        {content === "custom-embed" && (
                          <FormControl
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <TextField
                              id="custom-HTML"
                              label="Custom HTML"
                              variant="outlined"
                              multiline
                              rows={12}
                              value={customHTML}
                              onChange={handleChangeCustomHTML}
                            />
                          </FormControl>
                        )}
                      </Grid>
                      <Grid item xs={12} id="save-button">
                        <button
                          className="Button1"
                          onClick={handleSaveStreamSettings}
                        >
                          Save
                        </button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
              <div label="Chat / Ask a Question">
                <div className="settings-container">
                  <div className={classes.root}>
                    <FormControl
                      error={tabsEnabledError}
                      component="fieldset"
                      className={classes.formControl}
                    >
                      <FormLabel component="legend">Tabs Enabled</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={chat}
                              onChange={handleChangeTabsEnabled}
                              name="chat"
                            />
                          }
                          label="Chat"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={question}
                              onChange={handleChangeTabsEnabled}
                              name="question"
                            />
                          }
                          label="Ask a Question"
                        />
                      </FormGroup>
                      {tabsEnabledError === true && (
                        <FormHelperText>
                          Please choose at least one tab.
                        </FormHelperText>
                      )}
                    </FormControl>
                    <p>
                      If you would like to have multiple independent
                      chat/question windows, you can create and assign new rooms
                      below.
                    </p>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                        >
                          {/* Chat Room */}
                          <InputLabel
                            id="room"
                            className="fix-mui-select-label"
                          >
                            Room Assignment
                          </InputLabel>
                          <Select
                            labelId="room"
                            id="room-select"
                            required="true"
                            value={room}
                            onChange={handleChangeRoom}
                          >
                            {rooms.map((room) => {
                              return (
                                <MenuItem key={room.id} value={room.id}>
                                  {room.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <RoomTable rooms={rooms} fetchData={fetchChatRooms} />
                      </Grid>
                      <Grid item xs={12} id="save-button">
                        <button
                          className="Button1"
                          onClick={handleSaveStreamSettings}
                        >
                          Save
                        </button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        }
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(DesignBlockToolbar);
