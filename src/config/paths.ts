// Central path registry for reports, logs, screenshots, and visual assets.
// Keeping paths here avoids scattered hardcoded directories across the framework.
import fs from 'fs';
import path from 'path';
import { projectRoot } from './project-root';

export const paths = {
  projectRoot,
  reportsRoot: path.join(projectRoot, 'reports'),
  playwrightHtml: path.join(projectRoot, 'reports', 'playwright', 'html'),
  playwrightResults: path.join(projectRoot, 'reports', 'playwright', 'test-results'),
  allureResults: path.join(projectRoot, 'reports', 'allure-results'),
  allureReport: path.join(projectRoot, 'reports', 'allure-report'),
  cucumberHtml: path.join(projectRoot, 'reports', 'cucumber', 'cucumber-report.html'),
  cucumberJson: path.join(projectRoot, 'reports', 'cucumber', 'cucumber-report.json'),
  screenshotsRoot: path.join(projectRoot, 'reports', 'screenshots'),
  cucumberScreenshots: path.join(projectRoot, 'reports', 'screenshots', 'cucumber'),
  logsRoot: path.join(projectRoot, 'reports', 'logs'),
  structuredLogFile: path.join(projectRoot, 'reports', 'logs', 'framework.log'),
  visualRoot: path.join(projectRoot, 'visual'),
  visualBaselineRoot: path.join(projectRoot, 'visual', 'baseline'),
  visualActualRoot: path.join(projectRoot, 'visual', 'actual'),
  visualDiffRoot: path.join(projectRoot, 'visual', 'diff'),
  visualReportsRoot: path.join(projectRoot, 'visual', 'reports'),
  visualMismatchReport: path.join(projectRoot, 'visual', 'reports', 'mismatches.json')
};

for (const directoryPath of [
  paths.reportsRoot,
  path.dirname(paths.playwrightHtml),
  paths.playwrightResults,
  paths.allureResults,
  path.dirname(paths.cucumberHtml),
  paths.cucumberScreenshots,
  paths.logsRoot,
  paths.visualBaselineRoot,
  paths.visualActualRoot,
  paths.visualDiffRoot,
  paths.visualReportsRoot
]) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
