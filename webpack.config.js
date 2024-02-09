/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const package = require("./package.json");

module.exports = (env) => ({
  devtool: "cheap-module-source-map",
  entry: {
    action: path.join(__dirname, "./src/", "action.tsx"),
    background: path.join(__dirname, "./src/", "background.ts"),
    options: path.join(__dirname, "./src/", "options.tsx"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.svg$/,
      //   use: "@svgr/webpack",
      //   exclude: /node_modules/,
      // },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: ".",
          to: ".",
          context: "public",
        },
        {
          from: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
          to: "js/browser-polyfill.js",
        },
        {
          from: "templates/manifest.json",
          to: "manifest.json",
          transform(content) {
            const manifest = JSON.parse(content.toString());
            manifest.version = package.version;
            if (env.browser && env.browser === "chrome") {
              manifest.background = {
                service_worker: "js/background.js",
              };
              manifest.minimum_chrome_version = "88";
              manifest.optional_host_permissions = ["*://*/*"];
            }
            if (env.browser && env.browser === "firefox") {
              manifest.background = {
                scripts: ["js/background.js"],
              };
              manifest.browser_specific_settings = {
                gecko: {
                  id: "confluence-quick-search@anth0d",
                  strict_min_version: "109.0",
                },
              };
              manifest.host_permissions = ["*://*/*"];
            }
            return JSON.stringify(manifest, null, 2);
          },
        },
      ],
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          excludeChunks: ["background", "options"],
          filename: "action.html",
          inject: true,
          template: "templates/index.html",
        },
        {
          minify: {
            collapseWhitespace: true,
            keepClosingSlash: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          },
        },
      ),
    ),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          excludeChunks: ["background", "action"],
          filename: "options.html",
          inject: true,
          template: "templates/index.html",
        },
        {
          minify: {
            collapseWhitespace: true,
            keepClosingSlash: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          },
        },
      ),
    ),
  ],
});
