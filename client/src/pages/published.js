import React, { createElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import uuid from "react-uuid";
import axios from "axios";

import { connect } from "react-redux";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { Helmet } from "react-helmet";

import * as actions from "../actions";
import mapReactComponent from "../components/mapReactComponent";
import theme from "../templates/theme";
import RegistrationNotFound from "../components/RegistrationNotFound";
import { pageNames } from "../model/enums";
import BrandingTop from "../components/BrandingTop";
import BrandingBottom from "../components/BrandingBottom";
import Modal1 from "../components/Modal1";
import PollBlock from "../components/polling/PollBlock";
import ResultsChart from "../components/polling/ResultsChart";
import AlertModal from "../components/AlertModal";
import SimpleLoadingScreen from "../components/SimpleLoadingScreen";

const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/" : "/";

let socket;

const cookies = new Cookies();

const Published = (props) => {
  const { hash } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [openPoll, setOpenPoll] = useState(false);
  const [poll, setPoll] = useState({ question: "", options: [] });
  const [openResults, setOpenResults] = useState(false);
  const [resultsQuestion, setResultsQuestion] = useState("");
  const [results, setResults] = useState([]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [page, setPage] = useState("");
  const [error, setError] = useState("");
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    if (!cookies.get("uuid")) cookies.set("uuid", uuid());
    fetchDataAsync();
  }, [forceRefresh]);

  const fetchDataAsync = async () => {
    var attendeeId = null;

    const { event, pageType } = await props.fetchLivePage(
      props.subdomain,
      hash
    );

    // for private events only
    if (hash && event) {
      const { registration, activeDevices } = await props.fetchAttendeeData(
        hash,
        event.id
      );

      if (registration && activeDevices) {
        attendeeId = registration.id;

        // check if the max device limit has already been reached if there is a limit
        // Only perform check on initial visit, not on refreshes pushed by event moderator
        if (
          event.maxDevicesEnabled &&
          forceRefresh === 0 &&
          activeDevices.length >= event.maxDevices
        ) {
          setError("maxDevices");
          setIsLoaded(true);
          return null;
        }
      }
    }

    // Get user geo location
    try {
      const geoData = await axios.get(
        "https://ipapi.co/json/?key=ZI3PtfjXmB5MnPYgRatmyr5sVSjDkhGgtubHsmoy662Uw0VI5s"
      );

      var { latitude, longitude, city, country_name, country_code } =
        geoData.data;
    } catch {
      // return null if our subscription ran out
      var latitude,
        longitude,
        city,
        country_name,
        country_code = null;
    }

    // if geo fencing is enabled and there is geo data avaialble, check to confirm if the users region is on the allowed or on blocked list
    if (event.geoFencingEnabled && country_code) {
      // If the country is not on the only allow list, show the user the country error
      if (
        event.countryRestrictionType === "allowOnly" &&
        !event.countryCodes.includes(country_code)
      ) {
        setError("country");
        setIsLoaded(true);
        return null;
      }

      // if the country is on the block list, show the user the country error
      if (
        event.countryRestrictionType === "block" &&
        event.countryCodes.includes(country_code)
      ) {
        setError("country");
        setIsLoaded(true);
        return null;
      }
    }

    // if the pagetype is event, turn on analytics
    if (pageType == pageNames.EVENT) {
      socket = io(ENDPOINT, {
        path: "/api/socket/event",
        transports: ["websocket"],
      });

      socket.io.on("reconnect", () => {
        console.log("reconnected!");

        socket.emit("rejoin", {
          eventId: event.id,
          uuid: cookies.get("uuid") || "",
        });
      });

      socket.on("poll", ({ question, options, allowMultiple }) => {
        // If a user is in full screen, take them out of it so they can see the poll
        exitFullScreen();
        setPoll({ question, options, allowMultiple });
        setOpenPoll(true);
      });

      socket.on("pollClosed", () => {
        setOpenPoll(false);
      });

      socket.on("closeResults", () => {
        setOpenResults(false);
      });

      socket.on("results", ({ question, results, allowMultiple }) => {
        setResults(results);
        setResultsQuestion(question);
        setAllowMultiple(allowMultiple);
        setOpenResults(true);
      });

      socket.on("refreshPage", () => {
        setForceRefresh((forceRefresh) => forceRefresh + 1);
      });

      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

      socket.emit("join", {
        EventId: event.id,
        uuid: cookies.get("uuid"),
        attendeeId,
        geoData: {
          lat: latitude,
          long: longitude,
          city: city,
          country: country_name,
          countryCode: country_code,
        },
      });
    }

    setPage(pageType);
    setIsLoaded(true);
  };

  const closePoll = () => {
    setOpenPoll(false);
  };

  const exitFullScreen = () => {
    document.exitFullscreen().catch((err) => Promise.resolve(err));
  };

  const handleSubmitPoll = (selectedOptions) => {
    socket.emit("respondToPoll", selectedOptions);
    closePoll();
  };

  // if there is a hash provided but no attendee found, display an error page
  if (!isLoaded) {
    return <SimpleLoadingScreen />;
  } else if (!props.event.id) {
    return (
      <ErrorBox
        content={<p>Invalid Link. Please check your link and try again. </p>}
      />
    );
  } else if (error === "maxDevices") {
    return (
      <ErrorBox
        content={
          <div>
            <p>Hello {props.attendee.firstName},</p>
            <p>You’ve reached the maximum device limit for your event link.</p>
            <p>
              Please close the event on one of your other devices, then click
              Try Again.
            </p>
            <button
              className="Button1"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: "400",
                color: "#8a8a8a",
                marginTop: "20px",
              }}
            >
              Not {props.attendee.firstName}? Click{" "}
              <a className="link1" href="/">
                here
              </a>{" "}
              to receive your own event link.
            </p>
          </div>
        }
      />
    );
  } else if (error === "country") {
    return (
      <ErrorBox
        content={
          <div>
            <p>Sorry this event is not available in your region.</p>
          </div>
        }
      />
    );
  } else if (hash && !props.attendee) {
    // if there is a hash but no attendee returned
    return <RegistrationNotFound />;
  } else if (props.event.id) {
    return (
      <div className="page-container">
        <Helmet>
          <title>{props.event.title}</title>
        </Helmet>
        <Modal1
          open={openPoll}
          onClose={closePoll}
          content={
            <PollBlock
              question={poll.question}
              pollOptions={poll.options}
              allowMultiple={poll.allowMultiple}
              submitPoll={handleSubmitPoll}
            />
          }
        />
        <AlertModal
          open={openResults}
          onClose={() => setOpenResults(false)}
          content={
            <div style={{ padding: "40px 30px 10px", width: "500px" }}>
              <ResultsChart question={resultsQuestion} results={results} />
            </div>
          }
          closeText="Close"
        />
        <style>{theme(props.event.primaryColor)}</style>
        <div
          className="page-background"
          style={{
            backgroundImage: `url(${props.model.backgroundImage})`,
            boxShadow: `inset 0 0 0 10000px ${props.model.backgroundColor}`,
            filter: `blur(${props.model.backgroundBlur}px)`,
          }}
        ></div>
        <div className="fr-view live-page-container" key={forceRefresh}>
          {props.event.package.PackageType.type === "free" ? (
            <BrandingTop />
          ) : null}
          <div className="section-container">
            <div className="centering-spacer"></div>
            {props.model.sections.map(function (section) {
              return (
                <div className="section-block">
                  {section.isReact ? (
                    createElement(
                      mapReactComponent[section.reactComponent.name],
                      {
                        ...section.reactComponent.props,
                        sectionIndex: section.index,
                        isLive: true,
                      }
                    )
                  ) : (
                    <FroalaEditorView
                      key={section.id}
                      model={section.html.replace(
                        `contenteditable="true"`,
                        `contenteditable="false"`
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <BrandingBottom />
        </div>
      </div>
    );
  }
};

const ErrorBox = ({ content }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100vh" }}>
      <div className="form-box shadow-border">{content}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    model: state.model,
    event: state.event,
    settings: state.settings,
    attendee: state.attendee,
  };
};

export default connect(mapStateToProps, actions)(Published);
