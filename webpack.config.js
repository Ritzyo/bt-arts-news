const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js", // Update to .js
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$|.jsx/, // Update to match .js files
        exclude: /node_modules/,
        use: ["babel-loader"], // Use Babel or other JavaScript transpiler
      },
      {
        exclude: /node_modules/,
        test: /\.css$/i,
        use: {
            loader: 'babel-loader',
          },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "../manifest.json" },
      ],
    }),
    ...getHtmlPlugins(["index"]),
  ],
  resolve: {
    extensions: [".js"], // Update to include only .js extension
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map((chunk) =>
    new HTMLPlugin({
      title: "React extension",
      filename: `${chunk}.html`,
      chunks: [chunk],
    })
  );
}
