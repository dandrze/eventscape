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
import { streamChatModel } from "../templates/designBlockModels";
import theme from "../templates/theme";
import RegistrationNotFound from "../components/RegistrationNotFound";
import { pageNames } from "../model/enums";

const ENDPOINT =
  window.location.hostname.split(".")[
    window.location.hostname.split(".").length - 1
  ] === "localhost"
    ? "http://localhost:5000/"
    : "https://eventscape.io/";

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
      const geoData = await axios.get(
        "http://api.ipstack.com/187.252.203.71?access_key=" +
          process.env.REACT_APP_IPSTACK_KEY
      );

      var {
        latitude,
        longitude,
        city,
        country_name,
        country_code,
      } = geoData.data;
    } catch {
      // return null if our subsrciption ran out
      var { latitude, longitude, city, country_name, country_code } = null;
    }

    // if the pagetype is event, turn on analytics
    if (pageType == pageNames.EVENT) {
      socket = io(ENDPOINT, {
        path: "/api/socket/analytics",
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log(socket.id);
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

      setInterval(() => {
        socket.emit("pingVisit");
      }, 15000);
    }

    setIsLoaded(true);
  };

  const renderPage = () => {
    // if there is a hash provided but no attendee found, display an error page
    if (!isLoaded) {
      return <CircularProgress />;
    } else if (!props.event.id) {
      return <p>No Event Found</p>;
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

  return <div>{renderPage()}</div>;
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
