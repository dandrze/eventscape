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
    fetchData();
  }, []);

  const fetchData = async () => {
    props.setLoaded(false);
    await props.fetchEventFromId(event);
    await props.fetchModelFromId(model);
    props.setLoaded(true);
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

   .form-control:focus {
    border-color: ${props.event.primary_color} !important;
    box-shadow: 0 0 0 0rem rgba(255, 0, 162, 0.25); /* was 0.2rem */
  }
  
  .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected, .react-datepicker__close-icon::after {
    background-color: ${props.event.primary_color} !important;
  }
  
  .custom-control-input:checked ~ .custom-control-label::before {
    background-color: ${props.event.primary_color};
    border-color: ${props.event.primary_color};
  }
	
  `;

  return (
    <div className="fr-view live-page-container">
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
