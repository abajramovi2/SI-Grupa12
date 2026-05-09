const { spawn } = require('node:child_process');
const path = require('node:path');

const port = process.env.PORT || '4200';
const httpServerBin = path.join(__dirname, '..', 'node_modules', 'http-server', 'bin', 'http-server');
const child = spawn(
  process.execPath,
  [httpServerBin, 'dist/TIM12Frontend/browser', '-p', port],
  { stdio: 'inherit' }
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
