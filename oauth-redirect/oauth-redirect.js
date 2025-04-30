(function () {
    "use strict";

    function displayError(message) {
      document.body.innerHTML = "";

      const logo = document.createElement("img");
      logo.className = "logo";
      logo.src = "./favicon.svg";
      logo.alt = "Logo";
      document.body.appendChild(logo);

      const errorText = document.createElement("p");
      errorText.className = "error";
      errorText.textContent = message;
      document.body.appendChild(errorText);
    }

    const searchParams = new URLSearchParams(window.location.search);

    // get the app scheme from the query parameters
    let scheme = searchParams.get("scheme");

    if (!scheme) {
      displayError("Error: Missing scheme in query parameters.");
      return;
    }

    // we ensure the scheme includes "://"
    if (!scheme.includes("://")) {
      scheme += "://";
    }

    // parse the hash fragment that contains the oauth parameters
    const hash = window.location.hash.slice(1); // remove the leading '#' character
    if (!hash) {
      displayError("Error: Missing OAuth hash parameters.");
      return;
    }

    const hashParams = new URLSearchParams(hash);

    // build the scheme URL with the hash parameters
    const redirectUrl = `${scheme}?${hashParams.toString()}`;

    // redirect the browser to the custom scheme URL
    window.location.href = redirectUrl;
  })();