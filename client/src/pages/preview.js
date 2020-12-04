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

  return (
    <div className="fr-view">
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
  return { model: state.model };
};

export default connect(mapStateToProps, actions)(Preview);
