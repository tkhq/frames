const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");

// Optional: Define a strict type for your environment flags
interface EnvVariables {
  [key: string]: unknown;
}

// Optional: Define a strict type for CLI arguments
interface ArgvVariables {
  mode?: "production" | "development" | "none";
  [key: string]: unknown;
}

module.exports = (env: EnvVariables, argv: ArgvVariables) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    context: __dirname, // Set context to frame directory so module resolution works correctly
    entry: "./src/index.ts",
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
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.template.html",
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
      extensions: [".js", ".mjs", ".ts", ".tsx"],
      fallback: {
        crypto: false,
      },
      alias: {
        "@shared": path.resolve(__dirname, "../shared"),
      },
      conditionNames: ["import", "require", "node", "default"],
      // Ensure modules are resolved from frame's node_modules, not shared folder's
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
      // Don't use package.json from shared folder for module resolution
      descriptionFiles: ["package.json"],
      // Force resolution to start from context (frame directory) not file location
      symlinks: false,
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    },
    externals: {
      "node:crypto": "crypto",
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
