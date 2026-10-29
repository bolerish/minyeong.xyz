const path = require("node:path");

module.exports = {
  plugins: {
    "@stylexswc/postcss-plugin": {
      include: [
        "src/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
        path.join(process.cwd(), "node_modules/@bolerish/tokens/src/**/*.ts"),
      ],
      rsOptions: {
        aliases: {
          "~/*": [path.join(process.cwd(), "src", "*")],
        },
        dev: process.env.NODE_ENV === "development",
        unstable_moduleResolution: {
          type: "commonJS",
        },
      },
    },
    autoprefixer: {},
  },
};
