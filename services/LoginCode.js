const { sendEmail } = require("./Mailer");
const { Account } = require("../db").models;

const sendCode = async (emailAddress) => {
  const account = await Account.findOne({ where: { emailAddress } });

  if (account) {
    // Create a 6 digit login code that expires in 15 minutes
    const loginCode = Math.floor(100000 + Math.random() * 900000);
    const loginCodeExpiration = new Date();
    loginCodeExpiration.setMinutes(loginCodeExpiration.getMinutes() + 15);

    account.loginCode = loginCode;
    account.loginCodeExpiration = loginCodeExpiration;
    account.save();

    sendEmail(
      {
        to: emailAddress,
        subject: "Eventscape Login Code",
        html: `<p>Hello!</p>
  <p>here is your login code for Eventscape:</p>
  <p>${loginCode}</p>
  <p>This code expires after 15 minutes</p>
  <p>If you did not request a login from EventScape, please ignore this email. </p>`,
        useTemplate: true,
      },
      { email: "notifications@eventscape.io", name: "Eventscape" }
    );
    return true;
  } else {
    return false;
  }
};

module.exports = { sendCode };
