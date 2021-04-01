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
import Tabs from "./Tabs";
import RoomTable from "./room-table";

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

const StreamSettings = ({
  sectionIndex,
  reactComponent,
  handleClose,
  saveStreamSettings,
  fetchChatRooms,
  event,
}) => {
  const [content, setContent] = React.useState(
    reactComponent.props.content || "youtube-embed"
  );
  const [youtubeLink, setYoutubeLink] = React.useState(
    reactComponent.props.link || ""
  );
  const [customHTML, setCustomHTML] = React.useState(
    reactComponent.props.html || ""
  );
  const [room, setRoom] = React.useState(reactComponent.props.chatRoom);
  const [rooms, setRooms] = React.useState([]);

  const classes = useStyles();

  useEffect(() => {
    fetchChatRoomsAndUpdate();
  }, []);

  const fetchChatRoomsAndUpdate = async () => {
    const chatRooms = await fetchChatRooms(event.id);
    setRooms(chatRooms.data);
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

  const handleSaveStreamSettings = () => {
    saveStreamSettings(sectionIndex, {
      content,
      link: youtubeLink,
      html: customHTML,
      chatRoom: room,
    });
    handleClose();
  };

  return (
    <>
      <h3>Section Settings</h3>
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
                    <InputLabel id="content" className="fix-mui-select-label">
                      Content
                    </InputLabel>
                    <Select
                      labelId="content"
                      id="content-select"
                      required="true"
                      value={content}
                      onChange={handleChangeContent}
                    >
                      <MenuItem value={"youtube-live"}>Youtube Live</MenuItem>
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
                        Need help? Click Need help? Click here for instructions
                        on setting up a YouTube Live stream.
                      </p>
                      <p>
                        Heads up! YouTube may take down any streams containing
                        copyrighted music.
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
                    Update Section
                  </button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        <div label="Chat / Ask a Question">
          <div className="settings-container">
            <div className={classes.root}>
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
                  <p>
                    {" "}
                    If you would like to have multiple independent chat/question
                    windows, you can create and assign new rooms below.
                  </p>
                </Grid>
                <Grid item xs={12}>
                  <RoomTable
                    rooms={rooms}
                    fetchData={fetchChatRoomsAndUpdate}
                  />
                </Grid>
                <Grid item xs={12} id="save-button">
                  <button
                    className="Button1"
                    onClick={handleSaveStreamSettings}
                  >
                    Update Section
                  </button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Tabs>
    </>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(StreamSettings);
