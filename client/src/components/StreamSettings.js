import React, { useEffect, useState } from "react";
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
  const [content, setContent] = useState(
    reactComponent.props.content || "vimeo"
  );
  const [youtubeLink, setYoutubeLink] = useState(
    reactComponent.props.link || ""
  );
  const [customHTML, setCustomHTML] = useState(reactComponent.props.html || "");
  const [room, setRoom] = useState(reactComponent.props.chatRoom);
  const [rooms, setRooms] = useState([]);
  const [embedError, setEmbedError] = useState("");

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
    setEmbedError("");
    setCustomHTML(event.target.value);
  };

  const handleChangeRoom = (event) => {
    setRoom(event.target.value);
  };

  const handleSaveStreamSettings = () => {
    if (content && content != "youtube-live" && !customHTML) {
      setEmbedError("Please enter your embed code");
    } else {
      saveStreamSettings(sectionIndex, {
        content,
        link: youtubeLink || "",
        html: customHTML || "",
        chatRoom: room,
      });
      handleClose();
    }
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
                      <MenuItem value={"vimeo"}>Vimeo</MenuItem>
                      <MenuItem value={"wowza"}>Wowza</MenuItem>
                      <MenuItem value={"livestreamcom"}>
                        Livestream.com
                      </MenuItem>
                      <MenuItem value={"youtube-live"}>Youtube Live</MenuItem>
                      <MenuItem value={"custom-embed"}>
                        Custom HTML Embed (Advanced)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {content === "wowza" && (
                    <>
                      <p className="description-text">
                        Use the steps below to embed your video hosted on Wowza:
                        <ol>
                          <li>
                            Go to your{" "}
                            <a
                              className="url"
                              href="https://player.wowza.com/builder"
                            >
                              Wowza Player Builder
                            </a>
                          </li>
                          <li>
                            Input your desired settings and click{" "}
                            <strong>Get Embed Code</strong>
                          </li>
                          <li>
                            Return to this page and paste your embed code in the
                            text box below
                          </li>
                        </ol>
                      </p>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <TextField
                          id="custom-HTML"
                          label="Wowza Embed Code"
                          variant="outlined"
                          multiline
                          rows={12}
                          value={customHTML}
                          onChange={handleChangeCustomHTML}
                          helperText={embedError}
                          error={embedError}
                        />
                      </FormControl>
                    </>
                  )}
                  {content === "livestreamcom" && (
                    <>
                      <p className="description-text">
                        Use the steps below to embed your video hosted on
                        Livestream.com:
                        <ol>
                          <li>
                            Log into{" "}
                            <a className="url" href="https://livestream.com/">
                              Livestream.com
                            </a>
                          </li>
                          <li>Go to your event page.</li>
                          <li>
                            Click the share icon in the top right corner
                            <img src="https://media.screensteps.com/image_assets/assets/001/016/181/original/d667da90-0da4-4b86-9f21-0a9c0e0b2a39.png" />
                          </li>
                          <li>
                            Click <strong>Embed</strong> in the window that pops
                            up
                          </li>
                          <li>
                            Select <strong>640x360</strong> as the{" "}
                            <strong>Player Size</strong>
                          </li>
                          <li>
                            Click <strong>Copy</strong>
                          </li>
                          <li>
                            Return to this page and paste your embed code in the
                            text box below
                          </li>
                        </ol>
                      </p>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <TextField
                          id="custom-HTML"
                          label="Livestream.com Embed Code"
                          variant="outlined"
                          multiline
                          rows={12}
                          value={customHTML}
                          onChange={handleChangeCustomHTML}
                          helperText={embedError}
                          error={embedError}
                        />
                      </FormControl>
                    </>
                  )}
                  {content === "vimeo" && (
                    <>
                      <p className="description-text">
                        Use the steps below to embed your video hosted on Vimeo:
                        <ol>
                          <li>
                            Log into{" "}
                            <a className="url" href="https://vimeo.com/">
                              Vimeo
                            </a>
                          </li>
                          <li>
                            To get your video's embed code, select the video
                            from the Video Manager, then click the Embed button.
                            The embed code will be copied to your clipboard.
                            Return to this page.
                          </li>
                          <li>
                            Return to this page and paste your embed code in the
                            text box below
                          </li>
                        </ol>
                      </p>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <TextField
                          id="custom-HTML"
                          label="Vimeo Embed Code"
                          variant="outlined"
                          multiline
                          rows={12}
                          value={customHTML}
                          onChange={handleChangeCustomHTML}
                          helperText={embedError}
                          error={embedError}
                        />
                      </FormControl>
                    </>
                  )}
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
                        Need help? Click{" "}
                        <a
                          style={{
                            textDecoration: "underline",
                            color: "#b0281c",
                          }}
                          target="_blank"
                          href="https://www.eventscape.io/youtube-live-setup/"
                        >
                          here
                        </a>{" "}
                        for instructions on setting up a YouTube Live stream.
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
                        helperText={embedError}
                        error={embedError}
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
                  <p>
                    If you would like to have multiple independent chat/question
                    windows, you can create and assign new rooms below.
                  </p>
                </Grid>
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
