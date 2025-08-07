// cucumber.js

module.exports = {
  default: {
    require: [
      'hooks/**/*.ts',
      'step_definitions/**/*.ts'
    ],
    paths: [
      'features/**/*.feature'
    ],
    format: [
      'json:cucumber-report.json', // Required for the HTML report
      'summary' // Removed 'pretty' formatter
    ],
    publishQuiet: true,
    timeout: 60000
  }
};