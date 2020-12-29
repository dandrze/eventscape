import React, { createElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import { Helmet } from "react-helmet";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";
import mapReactComponent from "../components/mapReactComponent";
import { streamChatModel } from "../templates/designBlockModels";

const Published = (props) => {
  const { hash } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [attendee, setAttendee] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log(hash);
    if (hash) {
      const attendee = await props.fetchAttendeeData(hash);
      console.log(attendee);
      setAttendee(attendee);
    }

    const { event, pageModel } = await props.fetchLivePage(
      props.subdomain,
      hash
    );

    setIsLoaded(true);
  };

  const theme = `
  .fr-view button { 
    background: ${props.event.primary_color} !important;
    border-color: ${props.event.primary_color} !important;
  } 
  .fr-view h1 {
    color: ${props.event.primary_color};
  }
  .infoBar {
    background: ${props.event.primary_color};
  }

  .theme-button {
    background:${props.event.primary_color} !important;
  }
  
  `;

  console.log(Boolean(props.event.id));
  console.log(props.model);

  const renderPage = () => {
    // if there is a hash provided but no attendee found, display an error page
    if (!isLoaded) {
      return <CircularProgress />;
    } else if (!props.event.id) {
      return <p>No Event Found</p>;
    } else if (hash && !attendee) {
      // if there is a hash but no attendee returned
      // We can have a login page instead here in the future
      return <p>The unique link didn't work. Login page goes here</p>;
    } else if (props.event.id) {
      return (
        <div class="fr-view live-page-container">
          <Helmet>
            <title>{props.event.title}</title>
          </Helmet>
          <style>{theme}</style>
          <ul>
            {props.model.sections.map(function (section) {
              console.log(section);
              return section.is_react
                ? createElement(
                    mapReactComponent[section.react_component.name],
                    {
                      ...section.react_component.props,
                      sectionIndex: section.index,
                    }
                  )
                : ReactHtmlParser(section.html);
            })}
          </ul>
        </div>
      );
    }
  };

  return <div>{renderPage()}</div>;
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(Published);
