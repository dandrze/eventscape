import React from "react";

const InfoMessage = ({ header, body, icon }) => {
  return (
    <>
      {icon}
      <h2>{header}</h2>
      <div>{body}</div>
    </>
  );
};

export default InfoMessage;
