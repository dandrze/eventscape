import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactS3Uploader from "react-s3-uploader";
import PublishIcon from "@material-ui/icons/Publish";
import Button from "@material-ui/core/Button";
import { HexColorPicker, HexColorInput } from "react-colorful";
import Slider from "@material-ui/core/Slider";
import Modal1 from "./Modal1";

/* Tabs */
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import * as actions from "../actions";
import api from "../api/server";

import FoldingCube from "./FoldingCube";

const BackgroundImageSelector = ({
  event,
  handleClose,
  user,
  sectionIndex,
  model,
  updateSection,
}) => {
  const [openSelectImage, setOpenSelectImage] = useState(false);
  const [freeImageUrls, setFreeImageUrls] = useState([]);
  const [userImageUrls, setUserImageUrls] = useState([]);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(50);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchFreeImageUrls();
  }, []);

  const fetchFreeImageUrls = async () => {
    const res = await api.get("/api/aws/s3/background-images", {
      params: { userId: user.id },
    });

    // returns a list of free images and user images. Both lists start with an empty object so they need to be sliced when displaying
    const { freeImages, userImages } = res.data;

    setFreeImageUrls(freeImages);
    setUserImageUrls(userImages);
  };

  var currentBackgroundImageURL = model.sections[sectionIndex].html.includes(
    "url("
  )
    ? model.sections[sectionIndex].html.split("url(")[1].split(")")[0]
    : "";

  currentBackgroundImageURL = currentBackgroundImageURL.replace(/&quot;/g, "");

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClickSelectImage = () => {
    setOpenSelectImage(true);
  };

  const setBackgroundImage = (url) => {
    const newHtml = document.createElement("div");
    newHtml.innerHTML = model.sections[sectionIndex].html;

    const background = newHtml.getElementsByTagName("div")[0];

    background.style.backgroundImage = `url(${url})`;
    // ensure the background is positioned center and cover
    background.style.backgroundPosition = `center`;
    background.style.backgroundSize = `cover`;
    console.log(background.style.backgroundImage);

    updateSection(sectionIndex, newHtml.innerHTML);
    setOpenSelectImage(false);
  };

  const handleClickRemoveImage = () => {
    const newHtml = document.createElement("div");
    newHtml.innerHTML = model.sections[sectionIndex].html;

    const background = newHtml.getElementsByTagName("div")[0];

    background.style.backgroundImage = "";

    updateSection(sectionIndex, newHtml.innerHTML);
  };

  const handleChangeOpacity = (event, newOpacity) => {
    setOpacity(newOpacity);
    // update the overlay with the new opacity and current state of color
    handleUpdateOverlay(color, newOpacity);
  };

  const opacityFormat = (value) => {
    return value + "%";
  };

  const handleChangeColorOverlay = (newColor) => {
    setColor(newColor);
    // update the overlay with the new color and current state of opacity
    handleUpdateOverlay(newColor, opacity);
  };

  const handleUpdateOverlay = (color, opacity) => {
    const newHtml = document.createElement("div");
    newHtml.innerHTML = model.sections[sectionIndex].html;

    // get a reference to the base div
    const background = newHtml.getElementsByTagName("div")[0];

    // create a hex that includes opacity
    const overlayHex = color + Math.floor((opacity / 100) * 255).toString(16);

    // Modify the styling of the base div with a large box shadow to act as the image overlay
    // This code modifies the original newHTML object
    background.style.boxShadow = `inset 0 0 0 5000px ${overlayHex}`;

    // update the section with the new html
    updateSection(sectionIndex, newHtml.innerHTML);
  };

  return (
    <div>
      <Modal1
        open={openSelectImage}
        onClose={() => setOpenSelectImage(false)}
        content={
          <SelectImage
            user={user}
            setBackgroundImage={setBackgroundImage}
            freeImageUrls={freeImageUrls}
            userImageUrls={userImageUrls}
          />
        }
      />
      <Tabs
        value={tabValue}
        indicatorColor="primary"
        onChange={handleChangeTab}
      >
        <Tab className="fix-outline" label="Image" />
        <Tab className="fix-outline" label="Color Overlay" />
      </Tabs>
      <div>
        {tabValue === 0 ? (
          <Preview
            currentBackgroundImageURL={currentBackgroundImageURL}
            handleClickSelectImage={handleClickSelectImage}
            handleClickRemoveImage={handleClickRemoveImage}
          />
        ) : (
          <div style={{ padding: "18px" }}>
            <label>Background Color Overlay</label>
            <HexColorPicker
              color={color}
              onChange={handleChangeColorOverlay}
              id="event-color"
            />
            <HexColorInput color={color} onChange={setColor} id="hex-input" />
            <div>
              <label>Opacity</label>
            </div>
            <Slider
              value={opacity}
              onChange={handleChangeOpacity}
              min={0}
              max={100}
              valueLabelFormat={opacityFormat}
              valueLabelDisplay="on"
              style={{ marginTop: "40px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const UploadImage = ({ user, setBackgroundImage }) => {
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
    <div>
      <div style={{ height: "30px" }}></div>
      <div style={{ fontWeight: "bold" }}>Choose image from file</div>
      <div style={{ height: "30px" }}></div>
      <label>
        <div
          style={{
            width: "400px",
            borderRadius: "15px",
            height: "100px",
            border: "1px solid #cccccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f7f7",
            cursor: "pointer",
            margin: "0px 40px",
          }}
        >
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
          s3path={`user-uploads/user-${user.id}/`}
          contentDisposition="auto"
          scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/gi, "")}
          autoUpload={true}
        />
      </label>
      <div style={{ height: "30px" }}></div>
    </div>
  );
};

const SearchImages = ({
  freeImageUrls,
  userImageUrls,
  setBackgroundImage,
  type,
  handleClickUpload,
}) => {
  const handleClickImage = (event) => {
    setBackgroundImage(event.target.src);
  };

  return (
    <div>
      <div style={{ height: "30px" }}></div>
      <div style={{ fontWeight: "bold" }}>
        {type === "user"
          ? "Select one of your previously uploaded images below."
          : "Select one of our free images below."}
      </div>
      <div style={{ height: "30px" }}></div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {
          // if free images is empty, that means the client is still waiting for the response from the server, display loading spinner
          freeImageUrls.length === 0 ? (
            <FoldingCube />
          ) : // if the selected tab is user, display the users images
          type === "user" ? (
            // if the user image array is empty, the user has not uploaded any images
            userImageUrls.length === 0 ? (
              <div>
                You have no uploaded images. Upload an image{" "}
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "#b0281c",
                  }}
                  onClick={handleClickUpload}
                >
                  here
                </span>
              </div>
            ) : (
              // display all the images in the user image array
              userImageUrls.map((url, index) => (
                <img
                  onClick={handleClickImage}
                  src={url}
                  height="200px"
                  width="400px"
                  className="image-selector"
                  alt={`background-image-${index}`}
                  style={{ objectPosition: "bottom", objectFit: "cover" }}
                />
              ))
            )
          ) : (
            // display all the images in the free image url array
            freeImageUrls.map((url, index) => (
              <img
                onClick={handleClickImage}
                src={url}
                height="200px"
                width="400px"
                className="image-selector"
                alt={`background-image-${index}`}
                style={{ objectPosition: "bottom", objectFit: "cover" }}
              />
            ))
          )
        }
      </div>
    </div>
  );
};

const SelectImage = ({
  user,
  freeImageUrls,
  setBackgroundImage,
  userImageUrls,
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClickUpload = () => {
    setTabValue(2);
  };

  return (
    <div>
      <Tabs
        value={tabValue}
        indicatorColor="primary"
        onChange={handleChangeTab}
      >
        <Tab className="fix-outline" label="Your Images" />
        <Tab className="fix-outline" label="Free Images" />
        <Tab className="fix-outline" label="Upload Image" />
      </Tabs>

      {tabValue === 2 ? (
        <UploadImage user={user} setBackgroundImage={setBackgroundImage} />
      ) : (
        <SearchImages
          freeImageUrls={freeImageUrls}
          userImageUrls={userImageUrls}
          setBackgroundImage={setBackgroundImage}
          type={tabValue === 0 ? "user" : "free"}
          handleClickUpload={handleClickUpload}
        />
      )}
    </div>
  );
};

const Preview = ({
  currentBackgroundImageURL,
  handleClickSelectImage,
  handleClickRemoveImage,
}) => {
  console.log(currentBackgroundImageURL);
  return (
    <div style={{ padding: "18px" }}>
      {currentBackgroundImageURL ? (
        <>
          <div
            style={{
              width: "284px",
              height: "160px",
              backgroundImage: `url(${currentBackgroundImageURL})`,
              backgroundPosition: "bottom",
              backgroundSize: "cover",
            }}
          ></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              style={{ padding: "15px  15px", color: "#000000" }}
              onClick={handleClickSelectImage}
            >
              Replace Image
            </Button>
            <Button
              color="primary"
              style={{ padding: "15px 15px" }}
              onClick={handleClickRemoveImage}
            >
              Remove Image
            </Button>
          </div>
        </>
      ) : (
        <>
          <div
            onClick={handleClickSelectImage}
            style={{
              width: "284px",
              height: "160px",
              backgroundColor: "#f7f7f7",
              border: "1px solid #cccccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <PublishIcon style={{ margin: "3px", color: "#828282" }} />
            <span style={{ margin: "3px", color: "#828282" }}>
              ADD AN IMAGE
            </span>
          </div>
          <div style={{ height: "45px" }} />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, user: state.user };
};

export default connect(mapStateToProps, actions)(BackgroundImageSelector);
