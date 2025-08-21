const reporter = require('cucumber-html-reporter');
const path = require('path');

const options = {
  theme: 'bootstrap',
  jsonFile: path.join(__dirname, 'cucumber-report.json'),
  output: path.join(__dirname, 'cucumber-report.html'),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "Staging",
    "Browser": "Chrome",
    "Platform": "macOS"
  }
};

reporter.generate(options);
