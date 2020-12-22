const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

sgMail.setApiKey(keys.sendGridKey);

const sendEmail = async (email) => {
  console.log(email);
  const { to, subject, html } = email;
  const msg = {
    to,
    from: "david@homehop.ca",
    subject,
    text: html,
    html,
  };

  try {
    const response = await sgMail.send(msg);
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.sendEmail = sendEmail;
