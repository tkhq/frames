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

  // Extract the application deep-link scheme from the query string.
  // Example: with `?scheme=myapp`, we will later redirect to `myapp://?...`.
  let scheme = searchParams.get("scheme");

  if (!scheme) {
    displayError("Error: Missing scheme in query parameters.");
    return;
  }

  // Normalize the scheme so it always includes "://" (e.g., "myapp" -> "myapp://").
  if (!scheme.includes("://")) {
    scheme += "://";
  }

  // Determine the source of OAuth parameters.
  // Many providers return parameters in the URL hash (e.g., Google/Apple with id_token in the hash).
  // Others return them in the query string (e.g., code+PKCE flows like Facebook/Discord/Twitter).
  // We prefer the hash only if it contains clearly relevant keys; otherwise we fall back to the query.
  const rawHash = window.location.hash.slice(1);
  const hashParams = rawHash ? new URLSearchParams(rawHash) : null;
  const hashHasMeaningfulParams = !!(
    hashParams &&
    (hashParams.has("id_token") ||
      hashParams.has("access_token") ||
      hashParams.has("code"))
  );

  let paramsToForward;
  if (hashHasMeaningfulParams) {
    paramsToForward = hashParams;
  } else {
    // Fallback: use query parameters when hash is empty or meaningless
    // (e.g., some providers append "#_=_" which carries no data).
    paramsToForward = new URLSearchParams(window.location.search);
    paramsToForward.delete("scheme");
    if ([...paramsToForward.keys()].length === 0) {
      displayError("Error: Missing OAuth parameters.");
      return;
    }
  }

  // Build the deep-link URL to the host application by combining
  // the normalized scheme with whichever parameter source we selected.
  const redirectUrl = `${scheme}?${paramsToForward.toString()}`;

  // Perform the redirect to the application.
  window.location.href = redirectUrl;
})();
