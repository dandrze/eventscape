import React, { useState } from "react";
import { connect } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "./newSectionButton.css";

import {
  logoHeaderModel,
  simpleTitle,
  logoTitleHeaderModel,
  streamChatReact,
  registrationFormReact,
  registrationFormDescription,
  scheduleTable1,
  scheduleTable2,
  paragraph1,
  paragraph2,
  spacer,
} from "../templates/designBlockModels";
import GridSelector from "./GridSelector";
import * as actions from "../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "600px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "0px",
  },
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  gridSelectors: {
    margin: "0px 1% 20px",
    minWidth: "30%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const DesignBlockPicker = ({
  event,
  sectionIndex,
  setIsHovering,
  addSection,
  handleClose,
}) => {
  const classes = useStyles();
  const [blockCat, setBlockCat] = useState("title");

  const handleAddSection = async (
    html,
    isReact = false,
    reactComponent = null
  ) => {
    await addSection(sectionIndex, html, isReact, reactComponent);
  };

  const handleChangeBlockCat = (event) => {
    setBlockCat(event.target.value);
  };

  return (
    <div>
      <div className="block-picker-container">
        <h3>Choose a Design Block Template</h3>
        <FormControl
          variant="outlined"
          className={classes.formControl}
          style={{ marginBottom: "40px", marginTop: "30px" }}
        >
          {/* Category */}
          <InputLabel id="block-cat" className="mui-select-css-fix">
            Category
          </InputLabel>
          <Select
            labelId="block-cat"
            id="block-cat-select"
            required="true"
            value={blockCat}
            onChange={handleChangeBlockCat}
          >
            <MenuItem value={"title"}>Title/Logo</MenuItem>
            <MenuItem value={"registration"}>Registration</MenuItem>
            <MenuItem value={"stream-messaging"}>Stream/Messaging</MenuItem>
            <MenuItem value={"schedule"}>Agenda</MenuItem>
            <MenuItem value={"sponsors"}>Sponsors</MenuItem>
            <MenuItem value={"speakers"}>Speakers</MenuItem>
            <MenuItem value={"spacers"}>Spacers</MenuItem>
            <MenuItem value={"text"}>Text</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.root}>
          {blockCat === "title" && (
            <Grid container spacing={3}>
              {/* Logo Header */}
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/logoHeader.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(logoHeaderModel());
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/title.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(simpleTitle(event.title));
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/titleLogoWhite.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(logoTitleHeaderModel(null, event.title));
                  }}
                />
              </Grid>
            </Grid>
          )}

          {blockCat === "registration" && (
            <Grid container spacing={3}>
              {/* Description Registration */}
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/registrationHeader.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(
                      registrationFormDescription(
                        event.startDate,
                        event.endDate,
                        event.timeZone,
                        event.description
                      ),
                      true,
                      registrationFormReact
                    );
                  }}
                />
              </Grid>
            </Grid>
          )}

          {blockCat === "stream-messaging" && (
            <Grid container spacing={3}>
              {/* Stream Chat */}
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/streamChat.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(null, true, streamChatReact);
                  }}
                />
              </Grid>
            </Grid>
          )}

          {blockCat === "schedule" && (
            <Grid container spacing={3}>
              {/*Schedule Table Option 1 */}
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/scheduleTable1.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(scheduleTable1());
                  }}
                />
              </Grid>
              {/*Schedule Table Option 2*/}
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/scheduleTable2.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(scheduleTable2());
                  }}
                />
              </Grid>
            </Grid>
          )}

          {blockCat === "text" && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/paragraph1.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(paragraph1());
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={
                    "https://eventscape-assets.s3.amazonaws.com/assets/design-block-thumbnails/paragraph2.png"
                  }
                  handleClick={() => {
                    handleClose();
                    handleAddSection(paragraph2());
                  }}
                />
              </Grid>
            </Grid>
          )}

          {blockCat === "sponsors" && (
            <Grid container spacing={3}>
              {/* Stream Chat */}
              <Grid item xs={12}>
                <GridSelector
                  type="sponsors"
                  addSection={(html) => {
                    handleClose();
                    handleAddSection(html);
                  }}
                />
              </Grid>
            </Grid>
          )}

          {blockCat === "speakers" && (
            <Grid container spacing={3}>
              {/* Stream Chat */}
              <Grid item xs={12}>
                <GridSelector
                  type="speakers"
                  addSection={(html) => {
                    handleClose();
                    handleAddSection(html);
                  }}
                />
              </Grid>
            </Grid>
          )}
          {blockCat === "spacers" && (
            <Grid container spacing={3}>
              {/*Schedule Table Option 1 */}
              <Grid item xs={12}>
                <div
                  className="designBlockThumbnail"
                  style={{
                    textAlign: "center",
                    padding: "10px",
                  }}
                  onClick={() => {
                    handleClose();
                    handleAddSection(spacer(20));
                  }}
                >
                  Small
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  className="designBlockThumbnail"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                  onClick={() => {
                    handleClose();
                    handleAddSection(spacer(50));
                  }}
                >
                  Medium
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  className="designBlockThumbnail"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                  onClick={() => {
                    handleClose();
                    handleAddSection(spacer(100));
                  }}
                >
                  Large
                </div>
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    </div>
  );
};

const DesignBlockPreview = ({ src, handleClick }) => {
  return (
    <Tooltip title="Click to add">
      <img src={src} className="designBlockThumbnail" onClick={handleClick} />
    </Tooltip>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(DesignBlockPicker);
