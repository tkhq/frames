import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import path from "path";
import { pathToFileURL } from "url";

const indexPath = path.resolve(__dirname, "./index.html");

async function createDOMWithResourceLoading({ search = "", hash = "" } = {}) {
  const fileUrl = pathToFileURL(indexPath);
  const url = new URL(fileUrl.href);
  if (search) {
    url.search = search.startsWith("?") ? search : `?${search}`;
  }
  if (hash) {
    url.hash = hash.startsWith("#") ? hash : `#${hash}`;
  }

  const domInstance = await JSDOM.fromFile(indexPath, {
    // Necessary to run script tags
    runScripts: "dangerously",
    // Necessary to load external resources like ./oauth-redirect.js
    resources: "usable",
    // Set the document location so the script sees the intended query/hash
    url: url.href,
    beforeParse(window) {
      // Necessary for TextDecoder to be available.
      // See https://github.com/jsdom/jsdom/issues/2524
      window.TextDecoder = TextDecoder;
      window.TextEncoder = TextEncoder;
    },
  });

  // The script is "defer"; wait until the page's load event fires
  await new Promise((resolve) => {
    domInstance.window.addEventListener("load", () => resolve(), {
      once: true,
    });
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

  it("displays an error if the scheme is missing", async () => {
    dom = await createDOMWithResourceLoading({
      search: "?foo=bar",
      hash: "#id_token=abc",
    });

    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain(
      "Error: Missing scheme in query parameters."
    );
  });

  it("displays an error if OAuth parameters are missing in both hash and query", async () => {
    dom = await createDOMWithResourceLoading({ search: "?scheme=myapp" });

    const errorEl = dom.window.document.querySelector("p.error");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain("Error: Missing OAuth parameters.");
  });
});
