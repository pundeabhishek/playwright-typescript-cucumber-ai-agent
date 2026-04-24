const path = require('path');
const { spawnSync } = require('child_process');

const featureArgs = process.argv.slice(2);

if (!featureArgs.length) {
  console.error('Usage: npm run test:cucumber:feature -- bdd/features/login.feature');
  process.exit(1);
}

const cucumberPackageJson = require.resolve('@cucumber/cucumber/package.json');
const cucumberBin = path.join(path.dirname(cucumberPackageJson), 'bin', 'cucumber.js');

const result = spawnSync(process.execPath, [cucumberBin, '--config', 'cucumber.js'], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
  env: {
    ...process.env,
    CUCUMBER_FEATURES: featureArgs.join(',')
  }
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
