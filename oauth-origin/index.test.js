import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const indexPath = path.resolve(__dirname, "./index.html");
const scriptPath = path.resolve(__dirname, "./oauth-origin.js");

async function createDOMWithResourceLoading({ search = "" } = {}) {
  const fileUrl = pathToFileURL(indexPath);
  const url = new URL(fileUrl.href);
  if (search) {
    url.search = search.startsWith("?") ? search : `?${search}`;
  }

  const domInstance = await JSDOM.fromFile(indexPath, {
    // Necessary to run script tags
    runScripts: "dangerously",
    // Necessary to load external resources like ./oauth-origin.js
    resources: "usable",
    // Set the document location so the script sees the intended query
    url: url.href,
    beforeParse(window) {
      // Necessary for TextDecoder to be available.
      // See https://github.com/jsdom/jsdom/issues/2524
      window.TextDecoder = TextDecoder;
      window.TextEncoder = TextEncoder;
      // Stub navigation by overriding Location.prototype.href setter before any script runs
      try {
        window.__redirect_to = null;
        const originalDescriptor = Object.getOwnPropertyDescriptor(
          window.Location.prototype,
          "href"
        );
        Object.defineProperty(window.Location.prototype, "href", {
          configurable: true,
          enumerable: true,
          get() {
            return window.__redirect_to || "about:blank";
          },
          set(value) {
            window.__redirect_to = String(value);
          },
        });
        // Also stub assign/replace
        window.Location.prototype.assign = function (value) {
          window.__redirect_to = String(value);
        };
        window.Location.prototype.replace = function (value) {
          window.__redirect_to = String(value);
        };
        // Keep a reference in case future tests need original
        window.__original_location_href__ = originalDescriptor;
      } catch (e) {
        // ignore if we cannot stub navigation
      }
    },
  });

  return domInstance;
}

function waitForLoad(dom) {
  return new Promise((resolve) => {
    dom.window.addEventListener("load", () => resolve(), { once: true });
  });
}

async function createDOMWithoutResourceLoading({ search = "" } = {}) {
  const fileUrl = pathToFileURL(indexPath);
  const url = new URL(fileUrl.href);
  if (search) {
    url.search = search.startsWith("?") ? search : `?${search}`;
  }

  const domInstance = await JSDOM.fromFile(indexPath, {
    runScripts: "dangerously",
    url: url.href,
    beforeParse(window) {
      window.TextDecoder = TextDecoder;
      window.TextEncoder = TextEncoder;
      // capture redirect target via a simple variable
      window.__redirect_to = null;
    },
  });

  return domInstance;
}

function runScriptWithStubbedNavigation(dom) {
  const original = fs.readFileSync(scriptPath, "utf8");
  const stubbed = original.replace(
    /window\.location\.href\s*=\s*oauthUrl;/,
    "window.__redirect_to = oauthUrl;"
  );
  dom.window.eval(stubbed);
}

describe("OAuth origin", () => {
  let dom;

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  it("displays an error if required query parameters are missing", async () => {
    dom = await createDOMWithResourceLoading({ search: "?provider=google" });
    await waitForLoad(dom);

    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain("Missing query parameter");
    expect(errorEl.textContent).toContain("clientId");
    expect(errorEl.textContent).toContain("redirectUri");
    expect(errorEl.textContent).toContain("nonce");
  });

  it("displays an error for Facebook when codeChallenge is missing", async () => {
    dom = await createDOMWithResourceLoading({
      search:
        "?provider=facebook&clientId=dummy&redirectUri=https%3A%2F%2Fexample.com%3Fscheme%3Dmyapp&nonce=12345",
    });
    await waitForLoad(dom);
    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain("Missing query parameter");
    expect(errorEl.textContent).toContain("codeChallenge");
  });

  it("redirects to Facebook OAuth when all required params are present", async () => {
    dom = await createDOMWithoutResourceLoading({
      search:
        "?provider=facebook&clientId=myClient&redirectUri=https%3A%2F%2Fexample.com%3Fscheme%3Dmyapp&nonce=abc123&codeChallenge=cc123&state=provider%3Dfacebook%26flow%3Dredirect",
    });
    runScriptWithStubbedNavigation(dom);
    const location = dom.window.__redirect_to;
    // Should redirect to the Facebook OAuth URL with the expected params
    expect(
      location.startsWith("https://www.facebook.com/v23.0/dialog/oauth?")
    ).toBe(true);
    const qs = location.split("?")[1];
    const search = new URLSearchParams(qs);
    expect(search.get("client_id")).toBe("myClient");
    // Facebook normalizes redirect_uri to include a trailing slash before query
    expect(search.get("redirect_uri")).toBe(
      "https://example.com/?scheme=myapp"
    );
    expect(search.get("response_type")).toBe("code");
    expect(search.get("scope")).toBe("openid");
    expect(search.get("nonce")).toBe("abc123");
    expect(search.get("code_challenge")).toBe("cc123");
    expect(search.get("code_challenge_method")).toBe("S256");
    expect(search.get("state")).toBe("provider=facebook&flow=redirect");
  });

  it("redirects to Apple OAuth and normalizes redirect_uri with trailing slash before query", async () => {
    dom = await createDOMWithoutResourceLoading({
      search:
        "?provider=apple&clientId=myAppleClient&redirectUri=https%3A%2F%2Fexample.com%3Fscheme%3Dmyapp&nonce=xyz123",
    });
    runScriptWithStubbedNavigation(dom);
    const location = dom.window.__redirect_to;
    expect(
      location.startsWith("https://appleid.apple.com/auth/authorize?")
    ).toBe(true);
    const qs = location.split("?")[1];
    const search = new URLSearchParams(qs);
    expect(search.get("client_id")).toBe("myAppleClient");
    // Google does not normalize redirect_uri; it is passed as-is
    expect(search.get("redirect_uri")).toBe(
      "https://example.com/?scheme=myapp"
    );
    expect(search.get("response_type")).toBe("code id_token");
    expect(search.get("response_mode")).toBe("fragment");
    expect(search.get("nonce")).toBe("xyz123");
  });

  it("redirects to Google OAuth when all required params are present", async () => {
    dom = await createDOMWithoutResourceLoading({
      search:
        "?provider=google&clientId=myClient&redirectUri=https%3A%2F%2Fexample.com%3Fscheme%3Dmyapp&nonce=abc123",
    });
    runScriptWithStubbedNavigation(dom);
    const location = dom.window.__redirect_to;
    expect(
      location.startsWith("https://accounts.google.com/o/oauth2/v2/auth?")
    ).toBe(true);
    const qs = location.split("?")[1];
    const search = new URLSearchParams(qs);
    expect(search.get("client_id")).toBe("myClient");
    expect(search.get("redirect_uri")).toBe("https://example.com?scheme=myapp");
    expect(search.get("response_type")).toBe("code id_token");
    expect(search.get("scope")).toBe("openid email profile");
    expect(search.get("nonce")).toBe("abc123");
    expect(search.get("prompt")).toBe("select_account");
  });

  it("displays an error when redirectUri is invalid (non-absolute)", async () => {
    dom = await createDOMWithResourceLoading({
      search:
        "?provider=facebook&clientId=myClient&redirectUri=example.com&nonce=abc123&codeChallenge=cc123",
    });
    await waitForLoad(dom);
    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain("Invalid redirectUri");
  });
});
