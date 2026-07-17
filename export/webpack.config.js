const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  const signerEnvironment =
    process.env.TURNKEY_SIGNER_ENVIRONMENT_OVERRIDE || undefined;
  if (signerEnvironment != null) {
    console.warn(`Applying signer environment override: ${signerEnvironment}`);
  }

  return {
    mode: isProduction ? "production" : "development",
    context: __dirname, // Set context to frame directory so module resolution works correctly
    devServer: {
      port: 8081,
      devMiddleware: {
        writeToDisk: true,
      },
    },
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.[contenthash].js",
      publicPath: "/",
      clean: true,
      // Required for Subresource Integrity (SRI)
      crossOriginLoading: "anonymous",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "window.TURNKEY_SIGNER_ENVIRONMENT_OVERRIDE":
          JSON.stringify(signerEnvironment),
      }),
      new HtmlWebpackPlugin({
        template: "./index.template.html",
        filename: "index.html",
        inject: "body",
        meta: {
          "Content-Security-Policy": {
            "http-equiv": "Content-Security-Policy",
            content:
              "default-src 'self'; script-src 'self'; style-src 'self'; base-uri 'self'; object-src 'none'; form-action 'none'",
          },
        },
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : false,
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "styles.[contenthash].css",
            }),
            // This adds integrity hashes to <script> and <link> tags to prevent tampering
            new SubresourceIntegrityPlugin({
              hashFuncNames: ["sha384"],
            }),
          ]
        : []),
    ],
    resolve: {
      extensions: [".js", ".mjs"],
      fallback: {
        buffer: false,
        crypto: false,
        fs: false,
        http: false,
        https: false,
        net: false,
        os: false,
        path: false,
        stream: false,
        tls: false,
        url: false,
        zlib: false,
      },
      conditionNames: ["import", "require", "node", "default"],
      // Ensure modules are resolved from frame's node_modules, not shared folder's
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
      // Don't use package.json from shared folder for module resolution
      descriptionFiles: ["package.json"],
      // Force resolution to start from context (frame directory) not file location
      symlinks: true,
    },
    resolveLoader: {
      modules: ["node_modules", path.resolve(__dirname, "node_modules")],
    },
    externals: {
      "node:crypto": "commonjs crypto",
    },
    optimization: {
      // Reproducible builds so CI "dist matches committed" check passes
      moduleIds: "deterministic",
      chunkIds: "deterministic",
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    devtool: "source-map",
  };
};
