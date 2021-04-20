import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal1 from "../components/Modal1";
import NavBar3 from "../components/navBar3.js";
import PageEditor from "../components/pageEditor";
import "../components/fonts.css";
import { pageNames } from "../model/enums";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import Tour from "../components/Tour";

const Design = ({ event, model, fetchModel, user }) => {
  // open the tour if the user has not completed the tour
  const [openTour, setOpenTour] = useState(!user.tourComplete);
  const page = useParams().page || "event";

  useEffect(() => {
    // only fetch the model if the event data is finished fetching. Otherwise it is an empty obect
    if (Object.keys(event).length !== 0) {
      const modelId =
        page === pageNames.REGISTRATION
          ? event.RegPageModelId
          : event.EventPageModelId;

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
              <PageEditor key={model} page={page} />
            ) : (
              <AccessDeniedScreen message="Please contact the event owner to provide you with permissions to this page." />
            )
          ) : (
            <CircularProgress style={{ marginTop: "30vh" }} />
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
