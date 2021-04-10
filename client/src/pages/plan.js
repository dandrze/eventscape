import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import CircularProgress from "@material-ui/core/CircularProgress";
import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import Slider from "@material-ui/core/Slider";

import AlertModal from "../components/AlertModal";
import BillingTable from "../components/billing-table";
import "./plan.css";
import NavBar3 from "../components/navBar3.js";
import api from "../api/server";
import Modal1 from "../components/Modal1";
import PlanSliders from "../components/PlanSliders";

const Plan = ({ event, fetchEvent }) => {
  const [plan, setPlan] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openPricingMatrix, setOpenPricingMatrix] = React.useState(false);

  useEffect(() => {
    fetchDataAsync();
  }, []);

  const fetchDataAsync = async () => {
    const planRes = await api.get("/api/billing/plan", {
      params: { eventId: event.id },
    });

    const pricingRes = await api.get("/api/billing/pricing");

    setPlan(planRes.data);
    setPricing(pricingRes.data);
  };

  const handleClickUpdate = () => {
    setOpenPricingMatrix(true);
  };

  const handleClosePricingMatrix = () => {
    fetchEvent();
    fetchDataAsync();
    setOpenPricingMatrix(false);
    console.log("close matrix and fetch data");
  };

  return (
    <div>
      <AlertModal
        open={openUpgradeModal}
        onClose={() => setOpenUpgradeModal(false)}
        content={`Thank you for upgrading to professional. An Eventscape agent will contact you shortly to complete your upgrade.`}
        closeText="OK"
      />
      <Modal1
        open={openPricingMatrix}
        onClose={() => setOpenPricingMatrix(false)}
        content={
          pricing ? (
            <PlanSliders
              closeAndUpdate={handleClosePricingMatrix}
              event={event}
              currentPlan={plan}
              pricing={pricing}
            />
          ) : (
            <div>
              Could not retrieve pricing from server. Please refresh the page
              and try again
            </div>
          )
        }
      />
      <NavBar3
        displaySideNav="true"
        highlight="plan"
        content={
          <div className="mainWrapper container-width">
            {plan ? (
              plan.PlanType.type === "free" ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    className="form-box shadow-border"
                    style={{ minWidth: "350px", margin: "0px 16px" }}
                  >
                    <PersonIcon
                      style={{ fontSize: "40px", marginBottom: "30px" }}
                    />
                    <h3 style={{ marginBottom: "30px" }}>Free Plan</h3>
                    <p style={{ fontSize: "1rem" }}>
                      Get started with your own event website.
                    </p>

                    <hr style={{ marginBottom: "30px" }} />
                    <label style={{ marginBottom: "30px" }}>Current Plan</label>
                    <hr style={{ marginBottom: "30px" }} />
                    <ul className="feature-list">
                      <li>Event Website with Eventscape Logo</li>
                      <li>Registration Website with Eventscape Logo</li>
                      <li>Registration Email System</li>
                      <li>Event Analytics</li>
                      <li>Audience Chat, Q&A and Polling</li>
                      <li>Invite Team Members to Collaborate</li>
                      <li>Basic Support</li>
                    </ul>
                  </div>
                  <div
                    className="form-box shadow-border"
                    style={{ minWidth: "350px", margin: "0px 16px" }}
                  >
                    <GroupIcon
                      style={{
                        fontSize: "40px",
                        marginBottom: "30px",
                        color: "#b0281c",
                      }}
                    />
                    <h3
                      style={{
                        marginBottom: "30px",
                        fontWeight: "bold",
                        color: "#b0281c",
                      }}
                    >
                      Professional Plan
                    </h3>
                    <p style={{ fontSize: "1rem" }}>
                      Perfect for corporate and professional events.
                    </p>
                    <hr style={{ marginBottom: "30px" }} />
                    <button
                      style={{ marginBottom: "30px" }}
                      className="Button1"
                      onClick={handleClickUpdate}
                    >
                      Upgrade to Professional
                    </button>
                    <hr style={{ marginBottom: "30px" }} />
                    <ul className="feature-list">
                      <li>Hide Eventscape Logo</li>
                      <li>Custom Registration Form Fields</li>
                      <li>Location Based Analytics</li>
                      <li>Priority Support</li>
                      <li>
                        <hr />
                      </li>
                      <li>Event Website</li>
                      <li>Registration Website</li>
                      <li>Registration Email System</li>
                      <li>Event Analytics</li>
                      <li>Audience Chat, Q&A and Polling</li>
                      <li>Invite Team Members to Collaborate</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <BillingTable
                  plan={plan}
                  handleClickUpdate={handleClickUpdate}
                />
              )
            ) : (
              <CircularProgress />
            )}
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
