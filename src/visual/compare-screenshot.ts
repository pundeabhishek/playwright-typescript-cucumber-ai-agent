// Reusable visual-regression engine: create/update baseline, capture actual,
// compare pixels, write diff, and attach evidence to Allure.
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { Page, TestInfo } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { paths } from '@config/paths';
import { visualConfig, shouldUpdateBaseline } from '@config/visual-regression';
import { ArtifactManager } from '@utils/artifact-manager';
import { Logger } from '@utils/logger';
import { CompareScreenshotOptions, VisualComparisonResult } from './types';

type Pixelmatch = typeof import('pixelmatch').default;

let pixelmatchLoader: Promise<Pixelmatch> | undefined;
const dynamicImport = new Function('specifier', 'return import(specifier)') as (
  specifier: string
) => Promise<unknown>;

const buildVisualPath = (root: string, browserName: string, fileName: string): string => {
  const folder = path.join(root, browserName);
  ArtifactManager.ensureDirectory(folder);
  return path.join(folder, `${ArtifactManager.sanitizeName(fileName)}.png`);
};

const disableAnimations = async (page: Page): Promise<void> => {
  // Visual stability improves when transitions and animations are disabled
  // before screenshots are captured.
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      html {
        scroll-behavior: auto !important;
      }
    `
  });
};

const buildMaskLocators = (page: Page, selectors: string[]) => selectors.map(selector => page.locator(selector));

const captureVisual = async (options: CompareScreenshotOptions, outputPath: string): Promise<void> => {
  if (options.locatorSelector) {
    await options.page.locator(options.locatorSelector).first().screenshot({
      path: outputPath
    });
    return;
  }

  const mask = buildMaskLocators(options.page, options.maskSelectors ?? []);
  await options.page.screenshot({
    path: outputPath,
    fullPage: options.fullPage ?? visualConfig.fullPage,
    mask
  });
};

const attachFileIfExists = async (name: string, filePath: string): Promise<void> => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  await allure.attachment(name, fs.readFileSync(filePath), { contentType: 'image/png' });
};

const loadPixelmatch = async (): Promise<Pixelmatch> => {
  // Use a runtime import wrapper so CommonJS transpilation does not rewrite this back to require().
  if (!pixelmatchLoader) {
    pixelmatchLoader = dynamicImport('pixelmatch').then(module => (module as { default: Pixelmatch }).default);
  }

  return pixelmatchLoader;
};

export const compareScreenshot = async (
  options: CompareScreenshotOptions,
  testInfo: TestInfo
): Promise<VisualComparisonResult> => {
  const browserName = testInfo.project.use.browserName ?? testInfo.project.name;
  const threshold = options.threshold ?? visualConfig.threshold;
  const maxDiffPixels = options.maxDiffPixels ?? visualConfig.maxDiffPixels;
  const maxDiffRatio = options.maxDiffRatio ?? visualConfig.maxDiffRatio;
  const baselinePath = buildVisualPath(paths.visualBaselineRoot, browserName, options.name);
  const actualPath = buildVisualPath(paths.visualActualRoot, browserName, options.name);
  const diffPath = buildVisualPath(paths.visualDiffRoot, browserName, options.name);
  const updateBaseline = shouldUpdateBaseline();
  const baselineExists = fs.existsSync(baselinePath);

  await disableAnimations(options.page);

  if (!baselineExists || updateBaseline) {
    await captureVisual(options, baselinePath);

    Logger.info('Visual baseline created or updated.', {
      name: options.name,
      browserName,
      baselinePath,
      updateBaseline,
      locatorSelector: options.locatorSelector ?? null
    });

    const createdResult: VisualComparisonResult = {
      name: options.name,
      browserName,
      baselinePath,
      actualPath,
      diffPath,
      mismatch: false,
      pixelDifferenceCount: 0,
      diffRatio: 0,
      baselineCreated: !baselineExists,
      updatedBaseline: updateBaseline
    };

    await attachFileIfExists('visual-baseline', baselinePath);
    return createdResult;
  }

  await captureVisual(options, actualPath);

  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const actual = PNG.sync.read(fs.readFileSync(actualPath));

  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    throw new Error(
      `Visual comparison requires identical dimensions. Baseline=${baseline.width}x${baseline.height}, actual=${actual.width}x${actual.height}`
    );
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const pixelmatch = await loadPixelmatch();
  // pixelmatch gives us a strict pixel-level comparison and produces the diff image.
  const pixelDifferenceCount = pixelmatch(baseline.data, actual.data, diff.data, baseline.width, baseline.height, {
    threshold
  });
  const totalPixels = baseline.width * baseline.height;
  const diffRatio = totalPixels ? pixelDifferenceCount / totalPixels : 0;
  const mismatch = pixelDifferenceCount > maxDiffPixels || diffRatio > maxDiffRatio;

  if (pixelDifferenceCount > 0) {
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
  }

  Logger.info('Visual comparison completed.', {
    name: options.name,
    browserName,
    pixelDifferenceCount,
    diffRatio,
    mismatch,
    threshold,
    maxDiffPixels,
    maxDiffRatio,
    locatorSelector: options.locatorSelector ?? null
  });

  await allure.step(`Visual compare: ${options.name}`, async () => {
    await allure.parameter('browser', browserName);
    await allure.parameter('pixelDifferenceCount', String(pixelDifferenceCount));
    await allure.parameter('diffRatio', diffRatio.toFixed(6));
    await attachFileIfExists('visual-baseline', baselinePath);
    await attachFileIfExists('visual-actual', actualPath);
    await attachFileIfExists('visual-diff', diffPath);
  });

  return {
    name: options.name,
    browserName,
    baselinePath,
    actualPath,
    diffPath,
    mismatch,
    pixelDifferenceCount,
    diffRatio,
    baselineCreated: false,
    updatedBaseline: false
  };
};
