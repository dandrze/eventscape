import React from "react";
import { Link, Redirect } from "react-router-dom";
import SimpleNavBar from "../components/simpleNavBar";

export default () => {
  return (
    /*   <SimpleNavBar
      content={
        <div className="form-box shadow-border">
          <p>Event Not Found</p>
          <p>
            You have not created any events yet. Create a new event by clicking
            below.
          </p>
          <p>
            <Link to="/create-event" className="internal-link">
              Create event
            </Link>
          </p>
        </div>
      }
    /> */
    <Redirect
      to={{
        pathname: "/my-events",
      }}
    />
  );
};
