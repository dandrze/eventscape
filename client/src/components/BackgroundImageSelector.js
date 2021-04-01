import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactS3Uploader from "react-s3-uploader";
import PublishIcon from "@material-ui/icons/Publish";
import Button from "@material-ui/core/Button";

/* Tabs */
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import * as actions from "../actions";
import api from "../api/server";
import { CircularProgress } from "@material-ui/core";

const BackgroundImageSelector = ({
  handleClose,
  user,
  sectionIndex,
  model,
  updateSection,
}) => {
  const [step, setStep] = useState("start");
  const [freeImageUrls, setFreeImageUrls] = useState([]);

  useEffect(() => {
    fetchFreeImageUrls();
  }, []);

  const fetchFreeImageUrls = async () => {
    const res = await api.get("/api/aws/s3/free-images");

    console.log(res);

    setFreeImageUrls(res.data);
  };

  const matchBackgroundImageUrl = model.sections[sectionIndex].html.match(
    /url\((.*?)\)/
  );

  const currentBackgroundImageURL = matchBackgroundImageUrl
    ? matchBackgroundImageUrl[1]
    : "";

  const handleClickUploadImage = () => {
    setStep("upload");
  };

  const handleClickSearch = () => {
    setStep("search");
  };

  const setBackgroundImage = (url) => {
    var newHtml = "";

    if (currentBackgroundImageURL) {
      // find and replace the existing background image css
      newHtml = model.sections[sectionIndex].html.replace(
        /url\(.*?\)/,
        `url("${url}")`
      );
    } else {
      // otherwise add a background image into the first div (primary container)
      newHtml = model.sections[sectionIndex].html.replace(
        "<div",
        `<div style='background-image: url("${url}");background-position: center;background-size: cover;'`
      );
    }

    updateSection(sectionIndex, newHtml);
    handleClose();
  };

  return (
    <div>
      {step === "upload" ? (
        <UploadStep user={user} setBackgroundImage={setBackgroundImage} />
      ) : step === "search" ? (
        <SearchStep
          freeImageUrls={freeImageUrls}
          setBackgroundImage={setBackgroundImage}
        />
      ) : (
        <MainStep
          currentBackgroundImageURL={currentBackgroundImageURL}
          handleClickSearch={handleClickSearch}
          handleClickUploadImage={handleClickUploadImage}
        />
      )}
    </div>
  );
};

const UploadStep = ({ user, setBackgroundImage }) => {
  const [status, setStatus] = useState("");
  const [percent, setPercent] = useState("");

  const handleProgress = (percentComplete, uploadStatus) => {
    console.log(percentComplete);
    setPercent(percentComplete);
    setStatus(uploadStatus === "Waiting" ? "Preparing File" : uploadStatus);
  };

  const handleFinish = (result) => {
    const url = `https://eventscape-assets.s3.amazonaws.com/${result.filename}`;

    setBackgroundImage(url);
  };

  return (
    <>
      <div>Choose image from file</div>

      <div style={{ height: "30px" }}></div>
      <label>
        <div className="file-upload-section">
          {status ? (
            <div>
              <label style={{ display: "block" }}>{status}</label>
              {percent === 100 ? null : <label>{percent}% Complete</label>}
            </div>
          ) : (
            <div>
              <PublishIcon />
              <span style={{ margin: "15px" }}>Upload Image File</span>
            </div>
          )}
        </div>
        <ReactS3Uploader
          style={{ display: "none" }}
          onProgress={handleProgress}
          onError={console.log}
          onFinish={handleFinish}
          signingUrl="/api/s3/sign"
          signingUrlMethod="GET"
          accept="image/*"
          s3path={`uploads/${user.id}/`}
          uploadRequestHeaders={{ "x-amz-acl": "public-read" }} // this is the default
          contentDisposition="auto"
          scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/gi, "")}
          autoUpload={true}
        />
      </label>
      <div style={{ height: "30px" }}></div>
    </>
  );
};

const SearchStep = ({ freeImageUrls, setBackgroundImage }) => {
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickImage = (event) => {
    setBackgroundImage(event.target.src);
  };

  return (
    <div>
      <Tabs value={value} indicatorColor="primary" onChange={handleChangeTab}>
        <Tab label="Upload Image" />
        <Tab label="Free Images" />
      </Tabs>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      >
        {freeImageUrls.length === 0 ? (
          <CircularProgress />
        ) : (
          freeImageUrls.map((url, index) => (
            <img
              onClick={handleClickImage}
              src={url}
              height="200px"
              width="400px"
              className="image-selector"
              alt={`background-image-${index}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

const MainStep = ({
  currentBackgroundImageURL,
  handleClickSearch,
  handleClickUploadImage,
}) => {
  return (
    <div>
      <div
        style={{
          width: "400px",
          height: "150px",
          backgroundColor: "#f7f7f7",
          border: "1px solid #cccccc",
          backgroundImage: `url(${currentBackgroundImageURL})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="Button2"
          style={{ padding: "15px 30px" }}
          onClick={handleClickUploadImage}
        >
          {currentBackgroundImageURL ? "Replace Image" : "Upload Image"}
        </button>
      </div>
      <div style={{ height: "30px" }}></div>
      <Button onClick={handleClickSearch} color="primary">
        Search for Image
      </Button>
      <div style={{ height: "30px" }}></div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, user: state.user };
};

export default connect(mapStateToProps, actions)(BackgroundImageSelector);
