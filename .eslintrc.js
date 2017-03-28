module.exports = {
  extends: "airbnb",
  rules: {
    "no-template-curly-in-string": "off",
    "import/no-extraneous-dependencies": ["off", {devDependencies: ["**/*.test.js"]}]
  },
  env: {
    jest: true
  }
};
