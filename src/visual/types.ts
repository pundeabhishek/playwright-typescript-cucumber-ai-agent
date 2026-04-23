import { Locator, Page } from '@playwright/test';

export type CompareScreenshotOptions = {
  page: Page;
  name: string;
  fullPage?: boolean;
  locatorSelector?: string;
  threshold?: number;
  maxDiffPixels?: number;
  maxDiffRatio?: number;
  maskSelectors?: string[];
};

export type VisualComparisonResult = {
  name: string;
  browserName: string;
  baselinePath: string;
  actualPath: string;
  diffPath: string;
  mismatch: boolean;
  pixelDifferenceCount: number;
  diffRatio: number;
  baselineCreated: boolean;
  updatedBaseline: boolean;
};

export type VisualMismatch = VisualComparisonResult & {
  projectName: string;
  testTitle: string;
};

export type VisualFixtures = {
  compareScreenshot: (options: Omit<CompareScreenshotOptions, 'page'>) => Promise<VisualComparisonResult>;
  visualTracker: {
    addMismatch: (mismatch: VisualMismatch) => void;
    flush: () => void;
    assertNoMismatches: () => void;
  };
};

export type LocatorFactory = (selector: string) => Locator;
