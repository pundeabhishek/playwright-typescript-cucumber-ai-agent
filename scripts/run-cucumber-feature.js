const { spawnSync } = require('child_process');

const featureArgs = process.argv.slice(2);

if (!featureArgs.length) {
  console.error('Usage: npm run test:cucumber:feature -- bdd/features/login.feature');
  process.exit(1);
}

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const result = spawnSync(npxCommand, ['cucumber-js', '--config', 'cucumber.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CUCUMBER_FEATURES: featureArgs.join(',')
  }
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
