require("snowpack-plugin-glslify");
/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: {
    public: "/",
    src: "/dist",
  },
  plugins: ["snowpack-plugin-glslify"],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
