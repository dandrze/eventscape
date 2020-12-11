import React, { createElement, useEffect } from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import { Helmet } from "react-helmet";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";
import mapReactComponent from "../components/mapReactComponent";

const Published = (props) => {
  useEffect(() => {
    props.fetchLivePage(props.subdomain);
  }, []);

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

  const renderPage = () => {
    if (props.settings.loaded && props.model.sections.length) {
      return (
        <div>
          <Helmet>
            <title>{props.event.title}</title>
          </Helmet>
          <div class="fr-view">
            <style>{theme}</style>
            <ul>
              {props.model.sections.map(function (section) {
                return section.is_react
                  ? createElement(
                      mapReactComponent[section.react_component.name],
                      section.react_component.props
                    )
                  : ReactHtmlParser(section.html);
              })}
            </ul>
          </div>
        </div>
      );
    } else if (props.settings.loaded) {
      return <p>No Event Found</p>;
    } else {
      return <CircularProgress />;
    }
  };

  return <div>{renderPage()}</div>;
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(Published);
