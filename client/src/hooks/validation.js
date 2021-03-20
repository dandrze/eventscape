export const isValidEmailFormat = (emailAddress) => {
  const mailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  console.log(emailAddress);
  console.log(mailFormat.test(emailAddress));
  // returns true if the email format is valid. false if it is not
  return mailFormat.test(emailAddress);
};
