import React, { useEffect, createElement } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import ReactHtmlParser from "react-html-parser";
import { useParams } from "react-router-dom";
import "froala-editor/css/froala_style.min.css";
import mapReactComponent from "../components/mapReactComponent";

const Preview = (props) => {
  const { event, model } = useParams();
  useEffect(() => {
    props.fetchEventFromId(event);
    props.fetchModelFromId(model);
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

  return (
    <div className="fr-view">
      <style>{theme}</style>
      <ul>
        {props.model.sections.map(function (section) {
          console.log(section);
          return section.is_react
            ? createElement(mapReactComponent[section.react_component.name], {
                ...section.react_component.props,
                sectionIndex: section.index,
              })
            : ReactHtmlParser(section.html);
        })}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(Preview);
