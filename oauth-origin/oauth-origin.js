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

  function normalizeRedirectUriOrThrow(redirectUri) {
    // Use URL parsing only; throws for invalid/relative URLs.
    const u = new URL(redirectUri);
    // Returning toString() ensures host-only URLs render with trailing '/'
    // before any query/fragment (e.g., https://host?x=1 -> https://host/?x=1)
    return u.toString();
  }

  function getOAuthUrl(
    provider,
    clientId,
    redirectUri,
    nonce,
    codeChallenge,
    state
  ) {
    let baseUrl;
    let oauthParams = {};

    switch (provider.toLowerCase()) {
      case "google":
        baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        oauthParams = {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: "code id_token",
          scope: "openid email profile",
          nonce: nonce,
          prompt: "select_account",
        };
        if (state) {
          oauthParams.state = state;
        }
        break;
      case "apple": {
        baseUrl = "https://appleid.apple.com/auth/authorize";
        // Apple often requires a trailing slash in redirect URIs
        const normalizedRedirectUri = normalizeRedirectUriOrThrow(redirectUri);
        oauthParams = {
          client_id: clientId,
          redirect_uri: normalizedRedirectUri,
          response_type: "code id_token",
          response_mode: "fragment",
          nonce: nonce,
        };
        if (state) {
          oauthParams.state = state;
        }
        break;
      }
      case "facebook": {
        baseUrl = "https://www.facebook.com/v23.0/dialog/oauth";
        const normalizedRedirectUri = normalizeRedirectUriOrThrow(redirectUri);
        oauthParams = {
          client_id: clientId,
          redirect_uri: normalizedRedirectUri,
          response_type: "code",
          scope: "openid",
          nonce: nonce,
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
        };
        if (state) {
          oauthParams.state = state;
        }
        break;
      }
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
  // optional for some providers
  const codeChallenge = params.get("codeChallenge");
  const state = params.get("state");

  const missingParams = [];
  if (!provider) missingParams.push("provider");
  if (!clientId) missingParams.push("clientId");
  if (!redirectUri) missingParams.push("redirectUri");
  if (!nonce) missingParams.push("nonce");
  // Facebook requires PKCE (codeChallenge)
  if (provider && provider.toLowerCase() === "facebook" && !codeChallenge) {
    missingParams.push("codeChallenge");
  }

  if (missingParams.length > 0) {
    displayError(
      "Error: Missing query parameter" +
        (missingParams.length > 1 ? "s" : "") +
        ": " +
        missingParams.join(", ")
    );
    return;
  }

  let oauthUrl;
  try {
    oauthUrl = getOAuthUrl(
      provider,
      clientId,
      redirectUri,
      nonce,
      codeChallenge,
      state
    );
  } catch (e) {
    displayError("Error: Invalid redirectUri");
    return;
  }
  if (!oauthUrl) {
    displayError("Error: Unsupported provider.");
    return;
  }

  // redirect the browser to the google oauth URL
  window.location.href = oauthUrl;
})();
