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

/* Design Block Thumbnails: */
import logoHeader from "./designBlockThumbnails/logoHeaderGrey.png";
import titleThumb from "./designBlockThumbnails/title.png";
import titleLogoThumb from "./designBlockThumbnails/titleLogoWhite.png";
import streamChatThumb from "./designBlockThumbnails/streamChat.png";
import registrationHeaderThumb from "./designBlockThumbnails/registrationHeader.png";
import scheduleTable1Thumb from "./designBlockThumbnails/scheduleTable1.png";
import scheduleTable2Thumb from "./designBlockThumbnails/scheduleTable2.png";
import paragraph1Thumb from "./designBlockThumbnails/paragraph1.png";
import paragraph2Thumb from "./designBlockThumbnails/paragraph2.png";
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
  const [blockCat, setBlockCat] = useState("logo-header");

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
            <MenuItem value={"logo-header"}>Logo Header</MenuItem>
            <MenuItem value={"title"}>Title</MenuItem>
            <MenuItem value={"registration"}>Registration</MenuItem>
            <MenuItem value={"stream-messaging"}>Stream/Messaging</MenuItem>
            <MenuItem value={"schedule"}>Schedule/Program</MenuItem>
            <MenuItem value={"sponsors"}>Sponsors</MenuItem>
            <MenuItem value={"text"}>Text</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.root}>
          {blockCat === "logo-header" && (
            <Grid container spacing={3}>
              {/* Logo Header */}
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={logoHeader}
                  handleClick={() => {
                    handleClose();
                    handleAddSection(logoHeaderModel());
                  }}
                />
              </Grid>
            </Grid>
          )}

          {blockCat === "title" && (
            <Grid container spacing={3}>
              {/* Registration Page Title */}
              {/*    <Grid item xs={12}>
                      <DesignBlockPreview
                        src={heroBanner}
                        handleClick={() => {
                          handleClose();
                          handleAddSection(heroBannerModel(event.title));
                        }}
                      />
                    </Grid> */}

              {/* Event page title */}
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={titleThumb}
                  handleClick={() => {
                    handleClose();
                    handleAddSection(simpleTitle(event.title));
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={titleLogoThumb}
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
                  src={registrationHeaderThumb}
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
                  src={streamChatThumb}
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
                  src={scheduleTable1Thumb}
                  handleClick={() => {
                    handleClose();
                    handleAddSection(scheduleTable1());
                  }}
                />
              </Grid>
              {/*Schedule Table Option 2*/}
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={scheduleTable2Thumb}
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
                  src={paragraph1Thumb}
                  handleClick={() => {
                    handleClose();
                    handleAddSection(paragraph1());
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <DesignBlockPreview
                  src={paragraph2Thumb}
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
                  addSection={(html) => {
                    handleClose();
                    handleAddSection(html);
                  }}
                />
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
      <img src={src} id="designBlockThumbnail" onClick={handleClick} />
    </Tooltip>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(DesignBlockPicker);
