const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

sgMail.setApiKey(keys.sendGridKey);

const sendEmail = async (email) => {
  const { to, subject, html, replyTo } = email;
  const msg = {
    to,
    from: "david@homehop.ca",
    reply_to: replyTo,
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
