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

    function getOAuthUrl(provider, clientId, redirectUri, nonce) {
      let baseUrl;
      let oauthParams = {};

      switch (provider.toLowerCase()) {
        case "google":
          baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
          oauthParams = {
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "id_token",
            scope: "openid email profile",
            nonce: nonce,
            prompt: "select_account",
          };
          break;
        default:
          return null;
      }

      return `${baseUrl}?${new URLSearchParams(oauthParams).toString()}`;
    }

    const params = new URLSearchParams(window.location.search);

    // get the provider, clientId, redirectUri, and nonce from the query parameters
    const provider = params.get("provider");
    const clientId = params.get("clientId");
    const redirectUri = params.get("redirectUri");
    const nonce = params.get("nonce");

    const missingParams = [];
    if (!provider) missingParams.push("provider");
    if (!clientId) missingParams.push("clientId");
    if (!redirectUri) missingParams.push("redirectUri");
    if (!nonce) missingParams.push("nonce");

    if (missingParams.length > 0) {
      displayError(
        "Error: Missing query parameter" +
          (missingParams.length > 1 ? "s" : "") +
          ": " +
          missingParams.join(", ")
      );
      return;
    }

    const oauthUrl = getOAuthUrl(provider, clientId, redirectUri, nonce);
    if (!oauthUrl) {
      displayError("Error: Unsupported provider.");
      return;
    }

    // redirect the browser to the google oauth URL
    window.location.href = oauthUrl;
  })();