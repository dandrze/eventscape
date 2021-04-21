export default (userEmail, userFirstName, userLastName, propertyId, key) => {
  // initializes the tawk.to chat support widget
  if (!window) {
    throw new Error("DOM is unavailable");
  }

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  console.log({ userEmail, userFirstName, userLastName, propertyId, key });

  const tawk = document.getElementById("tawkId");
  if (tawk) {
    // Prevent TawkTo to create root script if it already exists

    // update the user email and name
    window.Tawk_API.visitor = {
      email: userEmail || "",
      name: userFirstName ? `${userFirstName} ${userLastName}` : "",
    };
    return window.Tawk_API;
  }

  const script = document.createElement("script");
  script.id = "tawkId";
  script.async = true;
  script.src = "https://embed.tawk.to/" + propertyId + "/" + key;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");

  const first_script_tag = document.getElementsByTagName("script")[0];
  if (!first_script_tag || !first_script_tag.parentNode) {
    throw new Error("DOM is unavailable");
  }

  first_script_tag.parentNode.insertBefore(script, first_script_tag);
};
