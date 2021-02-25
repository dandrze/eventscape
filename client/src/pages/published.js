import React, { createElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import uuid from "react-uuid";
import axios from "axios";

import { connect } from "react-redux";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { Helmet } from "react-helmet";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";
import mapReactComponent from "../components/mapReactComponent";
import theme from "../templates/theme";
import RegistrationNotFound from "../components/RegistrationNotFound";
import { pageNames } from "../model/enums";
import LongLoadingScreen from "../components/LongLoadingScreen";

const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/" : "/";

let socket;

const cookies = new Cookies();

const Published = (props) => {
  const { hash } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
        console.log(socket);

        socket.emit("rejoin", event.id);
      });
      console.log(socket);

      socket.on("poll", ({ question, options }) => {
        console.log({ question, options });
      });

      socket.on("pollClosed", () => {
        console.log("Poll closed!");
      });

      if (!cookies.get("uuid")) cookies.set("uuid", uuid());

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
