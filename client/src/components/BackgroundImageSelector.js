import React, { useState } from "react";
import { connect } from "react-redux";
import ReactS3Uploader from "react-s3-uploader";
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

  const handleProgress = (percentComplete, uploadStatus) => {
    setPercent(percentComplete);
    setStatus(uploadStatus === "Waiting" ? "Preparing File" : uploadStatus);
  };

  const handleFinish = (result) => {
    const url = `https://eventscape-assets.s3.amazonaws.com/${result.filename}`;
    setImageUrl(url);

    const newHtml = model.sections[sectionIndex].html.replace(
      /url\(.*?\)/,
      `url("${url}")`
    );

    updateSection(sectionIndex, newHtml);
  };

  return (
    <div>
      <div>Upload your own image</div>
      <div>{status}</div>
      <div>{percent}% Complete</div>
      <ReactS3Uploader
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, user: state.user };
};

export default connect(mapStateToProps, actions)(BackgroundImageSelector);
