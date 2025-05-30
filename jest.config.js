module.exports = {
  testEnvironment: "jsdom",
  reporters: [
    "default",
    [ "jest-junit", {
      outputDirectory: "./reports/test",
      outputName: "junit.xml"
    }]
  ]
};
