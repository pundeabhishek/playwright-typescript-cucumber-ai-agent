// Default visual-regression thresholds live here so teams can tune sensitivity
// without touching comparison logic in test files.
export const visualConfig = {
  threshold: Number(process.env.VISUAL_THRESHOLD ?? '0.1'),
  maxDiffPixels: Number(process.env.VISUAL_MAX_DIFF_PIXELS ?? '50'),
  maxDiffRatio: Number(process.env.VISUAL_MAX_DIFF_RATIO ?? '0.01'),
  fullPage: true,
  mismatchMode: process.env.VISUAL_MISMATCH_MODE === 'warn' ? 'warn' : 'fail'
};

export const shouldUpdateBaseline = (): boolean =>
  process.env.UPDATE_BASELINE === 'true' || process.argv.includes('--update-baseline');
