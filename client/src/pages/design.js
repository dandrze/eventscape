import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import FoldingCube from "../components/FoldingCube";

import Modal1 from "../components/Modal1";
import NavBar3 from "../components/navBar3.js";
import PageEditor from "../components/pageEditor";
import "../components/fonts.css";
import { pageNames } from "../model/enums";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import Tour from "../components/Tour";

const Design = ({ event, model, fetchModel, user }) => {
  // fetch the tour param from the url. If it's a new event, tourRequired will be set to the string "true", otherwise it will be null (falsey)
  const tourRequired = new URLSearchParams(window.location.search).get("tour");
  const openStreamSettings = new URLSearchParams(window.location.search).get(
    "stream"
  );
  // open the tour if the user has not completed the tour and if a tour is required
  const [openTour, setOpenTour] = useState(
    !user.tourComplete && Boolean(tourRequired)
  );
  const page = useParams().page || "event";

  useEffect(() => {
    // only fetch the model if the event data is finished fetching. Otherwise it is an empty obect
    if (Object.keys(event).length !== 0) {
      const modelId =
        page === "event" ? event.EventPageModelId : event.RegPageModelId;

      fetchModel(modelId);
    }
  }, [event, page]);

  const handleCloseTour = () => {
    setOpenTour(false);
  };

  return (
    <div>
      {openTour ? <Tour closeTour={handleCloseTour} /> : null}
      <NavBar3
        displaySideNav="true"
        highlight="design"
        content={
          model.sections.length ? (
            event.permissions?.design ? (
              <PageEditor
                key={model}
                page={page}
                openStreamSettings={openStreamSettings}
              />
            ) : (
              <AccessDeniedScreen message="Please contact the event owner to provide you with permissions to this page." />
            )
          ) : (
            <FoldingCube style={{ marginTop: "30vh" }} />
          )
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    event: state.event,
    model: state.model,
    settings: state.settings,
    user: state.user,
  };
};

export default connect(mapStateToProps, actions)(Design);
