// cucumber.js

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'hooks/**/*.ts',
      'step_definitions/**/*.ts'
    ],
    paths: [
      'features/**/*.feature'
    ],
    format: [
      'json:cucumber-report.json',
      'summary'
    ],
    publishQuiet: true,
    timeout: 60000
  }
};