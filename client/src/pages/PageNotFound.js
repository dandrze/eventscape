import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div className="form-box shadow-border">
      <p>Page Not Found</p>
      <p>
        <Link to="/" className="internal-link">
          Click here to return to App
        </Link>
      </p>
    </div>
  );
};
