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
import LongLoadingScreen from "../components/LongLoadingScreen";
import Modal1 from "../components/Modal1";
import PollBlock from "../components/polling/PollBlock";
import ResultsChart from "../components/polling/ResultsChart";
import AlertModal from "../components/AlertModal";

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

  useEffect(() => {
    if (!cookies.get("uuid")) cookies.set("uuid", uuid());
    fetchDataAsync();
  }, []);

  const fetchDataAsync = async () => {
    var attendeeId = null;

    const { event, pageType } = await props.fetchLivePage(
      props.subdomain,
      hash
    );

    if (hash) {
      const attendee = await props.fetchAttendeeData(hash, event.id);
      attendeeId = attendee.id;
    }

    // Get user geo location
    try {
      const geoData = await axios.get("https://ipapi.co//187.252.203.71/json");

      var {
        latitude,
        longitude,
        city,
        country_name,
        country_code,
      } = geoData.data;
    } catch {
      // return null if our subsrciption ran out
      var latitude,
        longitude,
        city,
        country_name,
        country_code = null;
    }

    // if the pagetype is event, turn on analytics
    if (pageType == pageNames.EVENT) {
      socket = io(ENDPOINT, {
        path: "/api/socket/event",
        transports: ["websocket"],
      });

      socket.io.on("reconnect", () => {
        console.log("reconnected!");

        console.log("cooke is:" + cookies.get("uuid"));

        socket.emit("rejoin", {
          eventId: event.id,
          uuid: cookies.get("uuid") || "",
        });
      });

      socket.on("poll", ({ question, options, allowMultiple }) => {
        console.log({ question, options });
        setPoll({ question, options, allowMultiple });
        setOpenPoll(true);
      });

      socket.on("pollClosed", () => {
        console.log("Poll closed!");
        setOpenPoll(false);
      });

      socket.on("closeResults", () => {
        setOpenResults(false);
      });

      socket.on("results", ({ question, results, allowMultiple }) => {
        console.log("results: ", { question, results, allowMultiple });
        setResults(results);
        setResultsQuestion(question);
        setAllowMultiple(allowMultiple);
        setOpenResults(true);
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

    setIsLoaded(true);
  };

  const closePoll = () => {
    setOpenPoll(false);
  };

  const handleSubmitPoll = (selectedOptions) => {
    socket.emit("respondToPoll", selectedOptions);
    closePoll();
  };

  // if there is a hash provided but no attendee found, display an error page
  if (!isLoaded) {
    return (
      <LongLoadingScreen text="Hang tight! You are now joining the event..." />
    );
  } else if (!props.event.id) {
    return (
      <>
        <p>Invalid Link. Please check your link and try again. </p>
      </>
    );
  } else if (hash && !props.attendee) {
    // if there is a hash but no attendee returned
    return <RegistrationNotFound />;
  } else if (props.event.id) {
    return (
      <div className="fr-view live-page-container">
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
        <ul>
          {props.model.sections.map(function (section) {
            return section.isReact ? (
              createElement(mapReactComponent[section.reactComponent.name], {
                ...section.reactComponent.props,
                sectionIndex: section.index,
                isLive: true,
              })
            ) : (
              <FroalaEditorView
                key={section.id}
                model={section.html.replace(
                  `contenteditable="true"`,
                  `contenteditable="false"`
                )}
              />
            );
          })}
        </ul>
      </div>
    );
  }
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
