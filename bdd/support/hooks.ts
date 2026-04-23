// Cucumber hooks manage scenario lifecycle, default timeouts, and step-level
// screenshot capture.
import { After, AfterStep, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { Logger } from '@utils/logger';
import fs from 'fs';
import { ArtifactManager } from '@utils/artifact-manager';
import { paths } from '@config/paths';

setDefaultTimeout(60_000);
let cleanedBddArtifacts = false;

Before(async function (this: CustomWorld, scenario) {
  // Clear BDD-specific reports once at the start of the run so classroom demos
  // do not mix stale screenshots and scenario output with the current execution.
  if (!cleanedBddArtifacts) {
    ArtifactManager.emptyDirectory(paths.cucumberScreenshots);
    ArtifactManager.emptyDirectory(paths.logsRoot);
    ArtifactManager.ensureDirectory(paths.cucumberScreenshots);
    ArtifactManager.ensureDirectory(paths.logsRoot);
    cleanedBddArtifacts = true;
    Logger.info('Cleaned BDD report folders before scenario execution.', {
      cucumberScreenshots: paths.cucumberScreenshots,
      logsRoot: paths.logsRoot
    });
  }

  await this.init(scenario);
});

After(async function (this: CustomWorld) {
  await this.destroy();
});

AfterStep(async function (this: CustomWorld, step) {
  // Capturing evidence after every step makes BDD execution easy to demonstrate
  // and debug, especially in training sessions.
  const stepName = step.pickleStep.text;
  const screenshotPath = await this.saveScreenshot(stepName);

  if (step.result?.status === Status.FAILED) {
    Logger.error(`BDD step failed. Screenshot saved to ${screenshotPath}`);
  } else {
    Logger.info(`BDD screenshot saved to ${screenshotPath}`);
  }

  const screenshotBuffer = fs.readFileSync(screenshotPath);
  await this.attach(screenshotBuffer, 'image/png');
});
