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

    // Prefer hash fragment for providers that return it (e.g., Google/Apple)
    const hash = window.location.hash.slice(1);

    let paramsToForward;
    if (hash) {
      paramsToForward = new URLSearchParams(hash);
    } else {
      // Fallback to query parameters for code+PKCE providers (e.g., Discord/Twitter)
      // Remove "scheme" from forwarded params
      paramsToForward = new URLSearchParams(window.location.search);
      paramsToForward.delete("scheme");
      if ([...paramsToForward.keys()].length === 0) {
        displayError("Error: Missing OAuth parameters.");
        return;
      }
    }

    // build the scheme URL with the selected parameters
    const redirectUrl = `${scheme}?${paramsToForward.toString()}`;

    // redirect the browser to the custom scheme URL
    window.location.href = redirectUrl;
  })();