const createWebpackConfig = require("./webpack.config");

function getContentSecurityPolicy(config) {
  const htmlPlugin = config.plugins.find(
    (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
  );
  return htmlPlugin.userOptions.meta["Content-Security-Policy"].content;
}

describe("webpack telemetry CSP templating", () => {
  it("templates only the telemetry origin into connect-src", () => {
    const config = createWebpackConfig({}, { mode: "production" });
    const contentSecurityPolicy = getContentSecurityPolicy(config);

    expect(contentSecurityPolicy).toContain(
      "connect-src 'self' __TURNKEY_TELEMETRY_ORIGIN__"
    );
    expect(contentSecurityPolicy).not.toContain(
      "__TURNKEY_TELEMETRY_ENDPOINT__"
    );
  });
});
