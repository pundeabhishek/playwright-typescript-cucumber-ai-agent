// Aggregates visual mismatches so tests can continue collecting evidence and
// fail once with a useful summary at teardown.
import fs from 'fs';
import { paths } from '@config/paths';
import { visualConfig } from '@config/visual-regression';
import { Logger } from '@utils/logger';
import { VisualMismatch } from './types';

export class VisualTracker {
  private static readonly allMismatches: VisualMismatch[] = [];
  private readonly mismatches: VisualMismatch[] = [];

  addMismatch(mismatch: VisualMismatch): void {
    this.mismatches.push(mismatch);
    VisualTracker.allMismatches.push(mismatch);
  }

  flush(): void {
    fs.writeFileSync(paths.visualMismatchReport, JSON.stringify(VisualTracker.allMismatches, null, 2), 'utf8');
  }

  assertNoMismatches(): void {
    if (!this.mismatches.length) {
      return;
    }

    const summary = this.mismatches
      .map(
        mismatch =>
          `${mismatch.testTitle} -> ${mismatch.name} (${mismatch.browserName}): ${mismatch.pixelDifferenceCount} px, ${(mismatch.diffRatio * 100).toFixed(2)}%`
      )
      .join('\n');

    if (visualConfig.mismatchMode === 'warn') {
      Logger.warn(`Visual mismatches detected in warn mode:\n${summary}`);
      return;
    }

    throw new Error(`Visual mismatches detected:\n${summary}`);
  }
}
