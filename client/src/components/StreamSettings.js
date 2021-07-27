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
  saveChatSettings,
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
    const embedCode = event.target.value;

    if (embedCode.includes("<script ")) {
      const safeSrcs = [
        `src="https://player.dacast.com`,
        `src='//player.cloud.wowza.com`,
      ];

      // if the embedCode contains an src that is not one of the safeSrcs, then flag an error
      if (!safeSrcs.some((safeSrc) => embedCode.includes(safeSrc))) {
        setEmbedError(
          "There was an issue with your embed code. Please contact support."
        );
      } else if (!embedCode.includes("></script>")) {
        setEmbedError(
          "There was an issue with your embed code. Please contact support."
        );
      } else {
        setEmbedError("");
      }
    } else {
      setEmbedError("");
    }
    setCustomHTML(embedCode);
  };

  const handleChangeRoom = (event) => {
    setRoom(event.target.value);
  };

  const handleSaveStreamSettings = () => {
    // If there are any errors, do not continue
    if (embedError) {
      return null;
    }
    if (content && content != "youtube-live" && !customHTML) {
      setEmbedError("Please enter your embed code");
    } else {
      saveStreamSettings(sectionIndex, {
        content,
        link: youtubeLink || "",
        html: customHTML || "",
      });
      handleClose();
    }
  };

  const handleSaveChatSettings = () => {
    saveChatSettings(sectionIndex, room);
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
                      <MenuItem value={"vimeo"}>Vimeo</MenuItem>
                      <MenuItem value={"wowza"}>Wowza</MenuItem>
                      <MenuItem value={"dacast"}>Dacast</MenuItem>
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
                        <div>
                          <ol>
                            <li>
                              Go to your{" "}
                              <a
                                className="url"
                                target="_blank"
                                rel="noopener noreferrer"
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
                              Return to this page and paste your embed code in
                              the text box below
                            </li>
                          </ol>
                        </div>
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

                  {content === "dacast" && (
                    <>
                      <p className="description-text">
                        Use the steps below to embed your video hosted on
                        Dacast:
                        <div>
                          <ol>
                            <li>
                              Go to your{" "}
                              <a
                                className="url"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.dacast.com/"
                              >
                                Dacast player
                              </a>
                            </li>
                            <li>Do some stuff...</li>
                          </ol>
                        </div>
                      </p>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <TextField
                          id="custom-HTML"
                          label="Dacast Embed Code"
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
                        <div>
                          <ol>
                            <li>
                              Log into{" "}
                              <a
                                className="url"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://vimeo.com/"
                              >
                                Vimeo
                              </a>
                            </li>
                            <li>Click New video, then Create live event.</li>
                            <li>Enter the requested info, then click next.</li>
                            <li>On the Embed tab, click Event Embed code.</li>
                            <li>
                              Make sure responsive is selected, then click Copy
                              code.
                            </li>
                            <li>
                              Return to this page and paste your embed code in
                              the text box below
                            </li>
                          </ol>
                        </div>
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
                          rel="noopener noreferrer"
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
                    Update Stream Settings
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
                  <button className="Button1" onClick={handleSaveChatSettings}>
                    Update Chat Settings
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
