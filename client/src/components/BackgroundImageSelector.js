import React, { useState } from "react";
import { connect } from "react-redux";
import ReactS3Uploader from "react-s3-uploader";
import PublishIcon from "@material-ui/icons/Publish";
import * as actions from "../actions";

const BackgroundImageSelector = ({
  onClose,
  user,
  sectionIndex,
  model,
  updateSection,
}) => {
  const [status, setStatus] = useState("");
  const [percent, setPercent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const handleClose = () => {
    onClose();
  };
  const [step, setStep] = useState("start");

  const matchBackgroundImageUrl = model.sections[sectionIndex].html.match(
    /url\(\"(.*?)\"\)/
  );

  const currentBackgroundImageURL = matchBackgroundImageUrl
    ? matchBackgroundImageUrl[1]
    : "";

  const handleProgress = (percentComplete, uploadStatus) => {
    setPercent(percentComplete);
    setStatus(uploadStatus === "Waiting" ? "Preparing File" : uploadStatus);
  };

  const handleFinish = (result) => {
    var newHtml = "";
    const url = `https://eventscape-assets.s3.amazonaws.com/${result.filename}`;
    setImageUrl(url);

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

    // wait for a moment for the user to read the status as "upload complete", and for the new image to load, then go back to the replace image step
    setTimeout(function () {
      setStep("start");
      setPercent(0);
      setStatus("");
    }, 1500);
  };

  const handleClickUploadImage = () => {
    setStep("upload");
  };

  return (
    <div>
      {step === "upload" ? (
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
              scrubFilename={(filename) =>
                filename.replace(/[^\w\d_\-.]+/gi, "")
              }
              autoUpload={true}
            />
          </label>
          <div style={{ height: "30px" }}></div>
        </>
      ) : (
        <div>
          <div
            style={{
              width: "400px",
              height: "150px",
              backgroundColor: "#f7f7f7",
              border: "1px solid #cccccc",
              backgroundImage: `url("${currentBackgroundImageURL}")`,
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
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, user: state.user };
};

export default connect(mapStateToProps, actions)(BackgroundImageSelector);
