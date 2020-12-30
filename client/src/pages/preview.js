import React, { useEffect, createElement } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import ReactHtmlParser from "react-html-parser";
import { useParams } from "react-router-dom";
import "froala-editor/css/froala_style.min.css";
import mapReactComponent from "../components/mapReactComponent";
import theme from "../templates/theme";

const Preview = (props) => {
  const { event, model } = useParams();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    props.setLoaded(false);
    await props.fetchEventFromId(event);
    await props.fetchModel(model);
    props.setLoaded(true);
  };

  return (
    <div className="fr-view live-page-container">
      <style>{theme(props.event.primary_color)}</style>
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
