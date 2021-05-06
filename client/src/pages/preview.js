import React, { useEffect, createElement } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { useParams } from "react-router-dom";
import "froala-editor/css/froala_style.min.css";
import mapReactComponent from "../components/mapReactComponent";
import theme from "../templates/theme";
import BrandingTop from "../components/BrandingTop";
import BrandingBottom from "../components/BrandingBottom";

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
    <div
      className="fr-view live-page-container"
      style={{
        backgroundImage: `url(${props.model.backgroundImage})`,
        width: "100%",
        height: "auto",
        position: "absolute",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: `inset 0 0 0 10000px ${props.model.backgroundColor}`,
      }}
    >
      <div
        style={{
          backdropFilter: `blur(${props.model.backgroundBlur}px)`,
        }}
      >
        <style>{theme(props.event.primaryColor)}</style>
        {props.event.plan.PlanType.type === "free" ? <BrandingTop /> : null}
        <div className="floating-section-container">
          {props.model.sections.map(function (section) {
            return (
              <div className="floating-section">
                {section.isReact ? (
                  createElement(
                    mapReactComponent[section.reactComponent.name],
                    {
                      ...section.reactComponent.props,
                      sectionIndex: section.index,
                      isLive: true,
                    }
                  )
                ) : (
                  <FroalaEditorView
                    model={section.html.replace(
                      `contenteditable="true"`,
                      `contenteditable="false"`
                    )}
                  />
                )}{" "}
              </div>
            );
          })}
        </div>
        <BrandingBottom />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(Preview);
