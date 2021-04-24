import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import SimpleNavBar from "../components/simpleNavBar";
import api from "../api/server";

export default () => {
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const res = await api.post("/api/account/verify-email", { token });
      console.log(res.data);
    };

    verifyEmail();
  }, []);

  return (
    <SimpleNavBar
      content={
        <div className="form-box shadow-border">
          <p>Thank you for verifying your email address!</p>
          <Link to="/">
            <button className="Button1" style={{ margin: "auto" }}>
              Go to App
            </button>
          </Link>
        </div>
      }
    />
  );
};
