import React, { createElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import uuid from "react-uuid";

import { connect } from "react-redux";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { Helmet } from "react-helmet";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";
import mapReactComponent from "../components/mapReactComponent";
import { streamChatModel } from "../templates/designBlockModels";
import theme from "../templates/theme";
import RegistrationNotFound from "../components/RegistrationNotFound";

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

  console.log(cookies.get("uuid"));

  useEffect(() => {
    socket = io(ENDPOINT, {
      path: "/api/socket/analytics",
      transports: ["websocket"],
    });

    let uniqueVisitorId;

    if (!cookies.get("uuid")) cookies.set("uuid", uuid());

    socket.on("connect", () => {
      console.log(socket.id);
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    console.log(hash);
    if (hash) {
      await props.fetchAttendeeData(hash);
    }

    const { eventId } = await props.fetchLivePage(props.subdomain, hash);

    socket.emit("join", { eventId, uuid: cookies.get("uuid") });

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
        <div class="fr-view live-page-container">
          <Helmet>
            <title>{props.event.title}</title>
          </Helmet>
          <style>{theme(props.event.primary_color)}</style>
          <ul>
            {props.model.sections.map(function (section) {
              return section.is_react ? (
                createElement(mapReactComponent[section.react_component.name], {
                  ...section.react_component.props,
                  sectionIndex: section.index,
                  isLive: true,
                })
              ) : (
                <FroalaEditorView
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
