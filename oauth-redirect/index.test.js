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

describe("OAuth redirect", () => {
  let dom;

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  it("displays an error if the scheme is missing", () => {
    const url = "http://localhost/?foo=bar#id_token=abc";
    dom = createDOM(url);

    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain(
      "Error: Missing scheme in query parameters."
    );
  });

  it("displays an error if OAuth hash parameters are missing", () => {
    const url = "http://localhost/?scheme=myapp";
    dom = createDOM(url);

    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain(
      "Error: Missing OAuth hash parameters."
    );
  });
});
