import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ReactS3Uploader from "react-s3-uploader";
import PublishIcon from "@material-ui/icons/Publish";
import Button from "@material-ui/core/Button";
import { RgbaColorPicker, HexColorInput } from "react-colorful";
import Slider from "@material-ui/core/Slider";
import Modal1 from "./Modal1";

/* Tabs */
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import * as actions from "../actions";
import api from "../api/server";

import FoldingCube from "./FoldingCube";
import { updateBackgroundBlur } from "../actions";

const BackgroundImageSelector = ({
  event,
  handleClose,
  user,
  sectionIndex,
  model,
  updateSection,
  isPrimaryBg,
  updateBackgroundImage,
  updateBackgroundColor,
  updateBackgroundBlur,
}) => {
  const [openSelectImage, setOpenSelectImage] = useState(false);
  const [freeImageUrls, setFreeImageUrls] = useState([]);
  const [userImageUrls, setUserImageUrls] = useState([]);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0, a: 0 });
  const [tabValue, setTabValue] = useState(0);
  const [currentBackgroundImageURL, setCurrentBackgroundImageURL] = useState(
    ""
  );

  useEffect(() => {
    fetchFreeImageUrls();
  }, []);

  useEffect(() => {
    if (isPrimaryBg) {
      setCurrentBackgroundImageURL(model.backgroundImage);

      // extract rgba values from the backgroundColor string
      const rgbaValues = model.backgroundColor
        .split("(")[1]
        .split(")")[0]
        .split(",");

      // Set the color to those rgba values
      setColor({
        r: parseInt(rgbaValues[0]),
        g: parseInt(rgbaValues[1]),
        b: parseInt(rgbaValues[2]),
        a: parseFloat(rgbaValues[3]),
      });
    } else {
      // get current background color overlay
      let pageHtml = document.createElement("div");
      pageHtml.innerHTML = model.sections[sectionIndex].html;

      let backgroundDiv = pageHtml.getElementsByTagName("div")[0];

      let rgbaList = backgroundDiv.style.boxShadow
        .substring(
          backgroundDiv.style.boxShadow.indexOf("(") + 1,
          backgroundDiv.style.boxShadow.indexOf(")")
        )
        .split(", ");

      setColor({
        r: parseInt(rgbaList[0]),
        g: parseInt(rgbaList[1]),
        b: parseInt(rgbaList[2]),
        a: parseFloat(rgbaList[3]),
      });

      setCurrentBackgroundImageURL(backgroundDiv.style.backgroundImage);
    }
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

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClickSelectImage = () => {
    setOpenSelectImage(true);
  };

  const setBackgroundImage = (url) => {
    setCurrentBackgroundImageURL(url);
    updateBackgroundImage(url);
    setOpenSelectImage(false);
  };
  const setSectionBackgroundImage = (url) => {
    const newHtml = document.createElement("div");
    newHtml.innerHTML = model.sections[sectionIndex].html;

    const background = newHtml.getElementsByTagName("div")[0];

    background.style.backgroundImage = `url(${url})`;
    // ensure the background is positioned center and cover
    background.style.backgroundPosition = `center`;
    background.style.backgroundSize = `cover`;

    setCurrentBackgroundImageURL(url);
    updateSection(sectionIndex, newHtml.innerHTML);
    setOpenSelectImage(false);
  };

  const removeSectionImage = () => {
    const newHtml = document.createElement("div");
    console.log({ model, sectionIndex });
    newHtml.innerHTML = model.sections[sectionIndex].html;

    const background = newHtml.getElementsByTagName("div")[0];

    background.style.backgroundImage = "";

    updateSection(sectionIndex, newHtml.innerHTML);
  };

  const removePrimaryBgImage = () => {
    setCurrentBackgroundImageURL("");
    updateBackgroundImage("");
  };

  const handleUpdateOverlay = (newColor) => {
    setColor(newColor);

    // convert rgba object to string
    const overlayRGBA = `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${
      newColor.a || 0
    })`;

    updateBackgroundColor(overlayRGBA);
  };

  const handleUpdateSectionOverlay = (newColor) => {
    setColor(newColor);

    const newHtml = document.createElement("div");
    newHtml.innerHTML = model.sections[sectionIndex].html;

    // get a reference to the base div
    const background = newHtml.getElementsByTagName("div")[2];

    // convert rgba object to string
    const overlayRGBA = `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${
      newColor.a || 0
    })`;

    // Modify the styling of the base div with a large box shadow to act as the image overlay
    // This code modifies the original newHTML object
    background.style.boxShadow = `inset 0 0 0 5000px ${overlayRGBA}`;

    // update the section with the new html
    updateSection(sectionIndex, newHtml.innerHTML);
  };

  const handleChangeBlurValue = (event, newValue) => {
    updateBackgroundBlur(newValue);
  };

  return (
    <div>
      <Modal1
        open={openSelectImage}
        onClose={() => setOpenSelectImage(false)}
        content={
          <SelectImage
            user={user}
            setBackgroundImage={
              isPrimaryBg ? setBackgroundImage : setSectionBackgroundImage
            }
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
          <>
            <Preview
              currentBackgroundImageURL={currentBackgroundImageURL}
              handleClickSelectImage={handleClickSelectImage}
              handleClickRemoveImage={
                isPrimaryBg ? removePrimaryBgImage : removeSectionImage
              }
              blur={isPrimaryBg ? model.backgroundBlur : 0}
            />
            {isPrimaryBg ? (
              <div style={{ margin: "0px 20px" }}>
                <label>Blur</label>
                <Slider
                  value={model.backgroundBlur}
                  onChange={handleChangeBlurValue}
                  min={0}
                  max={15}
                  step={1}
                  style={{ marginTop: "32px" }}
                  marks={true}
                  valueLabelDisplay="on"
                />
              </div>
            ) : null}
          </>
        ) : (
          <div style={{ padding: "18px" }}>
            <label>Background Color Overlay</label>
            <RgbaColorPicker
              color={color || `rgba(255,255,255,0)`}
              onChange={
                isPrimaryBg ? handleUpdateOverlay : handleUpdateSectionOverlay
              }
              id="event-color"
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
  blur,
}) => {
  return (
    <div style={{ padding: "18px 18px 0px 18px" }}>
      {currentBackgroundImageURL ? (
        <>
          <div style={{ width: "284px", height: "160px", overflow: "hidden" }}>
            <div
              style={{
                width: "297px",
                height: "180px",
                margin: "-10px",
                backgroundImage: `url(${currentBackgroundImageURL})`,
                backgroundPosition: "bottom",
                backgroundSize: "cover",
                filter: `blur(${blur}px)`,
              }}
            ></div>
          </div>
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
