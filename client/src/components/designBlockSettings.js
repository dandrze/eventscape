import React, { useEffect } from "react";
import { connect } from "react-redux";
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
import FormBuilder from "../components/FormBuilder";
import "../pages/registrations.css"; //required for registration form builder to size properly

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

function DesignBlockSettings(props) {
  const classes = useStyles();
  const [content, setContent] = React.useState("youtube-embed");
  const [youtubeLink, setYoutubeLink] = React.useState("");
  const [customHTML, setCustomHTML] = React.useState("");
  const [room, setRoom] = React.useState();
  const [rooms, setRooms] = React.useState([]);

  // Updating the settings based on props
  // UseEffect mimicks OnComponentDidMount
  useEffect(() => {
    if (props.reactComponent) {
      setContent(props.reactComponent.props.content);
      setYoutubeLink(props.reactComponent.props.link);
      setCustomHTML(props.reactComponent.props.html);
      setRoom(props.reactComponent.props.chatRoom);
    }
    //fetch chat rooms for chat settings
    if (props.isReact) {
      switch (props.reactComponent.name) {
        case "StreamChat":
          fetchChatRooms();
          break;
      }
    }
  }, []);

  // set required settings based on design block name:
  const showStreamChatSettings =
    props.isReact && props.reactComponent.name == "StreamChat";

  const showRegistrationSettings =
    props.isReact && props.reactComponent.name == "RegistrationForm";

  const fetchChatRooms = async () => {
    const chatRooms = await props.fetchChatRooms(props.event.id);
    setRooms(chatRooms.data);
  };

  const handleSaveStreamSettings = () => {
    handleClose();
    props.saveStreamSettings(props.sectionIndex, {
      content,
      link: youtubeLink,
      html: customHTML,
      chatRoom: room,
    });
    props.triggerChatUpdate();
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

  const { onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      {showStreamChatSettings === true && (
        <>
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
                            Need help? Click here for instructions on setting up
                            a YouTube Live stream.
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
                  <p>
                    If you would like to have multiple independent chat/question
                    windows, you can create and assign new rooms below.
                  </p>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        {/* Chat Room */}
                        <InputLabel id="room" className="fix-mui-select-label">
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
        </>
      )}
      {showRegistrationSettings === true && <FormBuilder />}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(DesignBlockSettings);
