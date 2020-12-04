import React, { useEffect, createElement } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import ReactHtmlParser from "react-html-parser";
import { useParams } from "react-router-dom";
import "froala-editor/css/froala_style.min.css";
import StreamChat from "../components/pageReactSections/stream-chat";

const Preview = (props) => {
  const { event, model } = useParams();
  useEffect(() => {
    props.fetchEventFromId(event);
    props.fetchModelFromId(model);
  }, []);

  const mapReactComponent = {
    StreamChat: StreamChat,
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

	 .sendButton {
		background:${props.event.primary_color};
	 }
	
  `;

  return (
    <div className="fr-view">
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
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(Preview);
