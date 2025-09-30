import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

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

  it("displays an error for Facebook when codeChallenge is missing", () => {
    const url =
      "http://localhost/?provider=facebook&clientId=dummy&redirectUri=https%3A%2F%2Fexample.com%3Fscheme%3Dmyapp&nonce=12345";
    dom = createDOM(url);
    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain("Missing query parameter");
    expect(errorEl.textContent).toContain("codeChallenge");
  });

  it("redirects to Facebook OAuth when all required params are present", () => {
    const url =
      "http://localhost/?provider=facebook&clientId=myClient&redirectUri=https%3A%2F%2Fexample.com%3Fscheme%3Dmyapp&nonce=abc123&codeChallenge=cc123&state=provider%3Dfacebook%26flow%3Dredirect";
    dom = createDOM(url);
    const location = dom.window.location.href;
    // Should redirect to the Facebook OAuth URL with the expected params
    expect(location.startsWith("https://www.facebook.com/v11.0/dialog/oauth?")).toBe(
      true
    );
    const qs = location.split("?")[1];
    const search = new URLSearchParams(qs);
    expect(search.get("client_id")).toBe("myClient");
    expect(search.get("redirect_uri")).toBe(
      "https://example.com?scheme=myapp"
    );
    expect(search.get("response_type")).toBe("code");
    expect(search.get("scope")).toBe("openid");
    expect(search.get("nonce")).toBe("abc123");
    expect(search.get("code_challenge")).toBe("cc123");
    expect(search.get("code_challenge_method")).toBe("S256");
    expect(search.get("state")).toBe("provider=facebook&flow=redirect");
  });
});
