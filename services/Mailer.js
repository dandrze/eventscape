const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

sgMail.setApiKey(keys.sendGridKey);

const sendEmail = async (email) => {
  const { from, subject, html } = email;
  const msg = {
    to: "andrzejewski.d@gmail.com",
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

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

exports.sendEmail = sendEmail;
