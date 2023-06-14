const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      "@play": path.resolve(__dirname, "src"),
    },
  },
};
