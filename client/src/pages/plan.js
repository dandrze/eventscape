import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import CircularProgress from "@material-ui/core/CircularProgress";
import BillingTable from "../components/billing-table";
import "./plan.css"

import NavBar3 from "../components/navBar3.js";

const Plan = ({ event, model, fetchModel }) => {

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        highlight="plan"
        content={
          <div className="mainWrapper container-width">
            <div style={{ maxWidth: "800px" }}>
              <BillingTable />
            </div>
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, settings: state.settings };
};

export default connect(mapStateToProps, actions)(Plan);

