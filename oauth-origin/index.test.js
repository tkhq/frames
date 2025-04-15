import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs
  .readFileSync(path.resolve(__dirname, "./index.html"), "utf8")
  .replace("${TURNKEY_SIGNER_ENVIRONMENT}", "prod");

function createDOM(url) {
  const domInstance = new JSDOM(html, {
    // Necessary to run script tags
    runScripts: "dangerously",
    url,
    beforeParse(window) {
      // Necessary for TextDecoder to be available.
      // See https://github.com/jsdom/jsdom/issues/2524
      window.TextDecoder = TextDecoder;
      window.TextEncoder = TextEncoder;
    },
  });

  return domInstance;
}

describe("OAuth origin", () => {
  let dom;

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  it("displays an error if required query parameters are missing", () => {
    const url = "http://localhost/?provider=google";
    dom = createDOM(url);

    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain("Missing query parameter");
    expect(errorEl.textContent).toContain("clientId");
    expect(errorEl.textContent).toContain("redirectUri");
    expect(errorEl.textContent).toContain("nonce");
  });

  it("displays an error for an unsupported provider", () => {
    const url =
      "http://localhost/?provider=facebook&clientId=dummy&redirectUri=https%3A%2F%2Fexample.com%3Fscheme%3Dmyapp&nonce=12345";
    dom = createDOM(url);
    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain(
      'Error: Unsupported provider "facebook"'
    );

    // since the redirectUri exists, a back button should be rendered with an app URL scheme
    const backButton = dom.window.document.querySelector("button.back-button");
    expect(backButton).not.toBeNull();
    expect(backButton.getAttribute("onclick")).toContain("myapp://");
  });
});
