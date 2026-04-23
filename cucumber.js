// Central Cucumber runner configuration for features, step loading, and HTML/JSON reporting.
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const cucumberReportDirectory = path.join(projectRoot, 'reports', 'cucumber');
const allureResultsDirectory = path.join(projectRoot, 'reports', 'allure-results');
const cucumberHtmlReport = path.posix.join('reports', 'cucumber', 'cucumber-report.html');
const cucumberJsonReport = path.posix.join('reports', 'cucumber', 'cucumber-report.json');
const configuredFeaturePaths = process.env.CUCUMBER_FEATURES
  ? process.env.CUCUMBER_FEATURES.split(',').filter(Boolean)
  : ['bdd/features/**/*.feature'];
fs.mkdirSync(cucumberReportDirectory, { recursive: true });
fs.mkdirSync(allureResultsDirectory, { recursive: true });

module.exports = {
  default: {
    paths: configuredFeaturePaths,
    require: ['bdd/steps/**/*.ts', 'bdd/support/**/*.ts'],
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    format: [
      'progress-bar',
      'allure-cucumberjs/reporter',
      `html:${cucumberHtmlReport}`,
      `json:${cucumberJsonReport}`
    ],
    formatOptions: {
      resultsDir: allureResultsDirectory
    },
    parallel: 1,
    publishQuiet: true
  }
};
