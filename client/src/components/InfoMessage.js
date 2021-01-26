import React, { useState, useEffect } from "react";

const InfoMessage = ({ header, body }) => {
  return (
    <>
      <h2>{header}</h2>
      <div>{body}</div>
    </>
  );
};

export default InfoMessage;
