const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: {
      index: "./src/index.js",
      standalone: "./src/standalone.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].bundle.[contenthash].js",
      publicPath: "/",
      clean: true,
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
      // Iframe page (embedded version)
      new HtmlWebpackPlugin({
        template: "./src/index.template.html",
        filename: "index.html",
        chunks: ["index"],
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
      // Standalone page (testing version)
      new HtmlWebpackPlugin({
        template: "./src/standalone.template.html",
        filename: "standalone.html",
        chunks: ["standalone"],
        inject: "body",
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: false,
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
      // Copy favicon
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "favicon.svg",
            to: "favicon.svg",
          },
        ],
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "[name].styles.[contenthash].css",
            }),
          ]
        : []),
    ],
    resolve: {
      extensions: [".js"],
      fallback: {
        crypto: false,
      },
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          // Shared vendor code (e.g., @hpke/core used by both pages)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          // Shared turnkey-core utilities
          common: {
            test: /[\\/]src[\\/]turnkey-core\.js/,
            name: "common",
            chunks: "all",
            minChunks: 2,
          },
        },
      },
    },
    devtool: "source-map",
  };
};
