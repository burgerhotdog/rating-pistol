import { performance } from 'node:perf_hooks';
import { createServer } from 'vite';

const usage = 'Usage: npm run rotation:benchmark -- <game> <char> [<char> ...] [--warmup=N] [--iterations=N]';
const args = process.argv.slice(2);
const positional = [];
let warmup = 20;
let iterations = 200;

for (const arg of args) {
  if (!arg.startsWith('--')) {
    positional.push(arg);
    continue;
  }

  const match = /^--(warmup|iterations)=(\d+)$/.exec(arg);
  if (!match) {
    console.error(`Invalid option: ${arg}\n${usage}`);
    process.exit(1);
  }

  const count = Number(match[2]);
  if (!Number.isSafeInteger(count) || (match[1] === 'iterations' && count === 0)) {
    console.error(`Invalid count: ${arg}\n${usage}`);
    process.exit(1);
  }

  if (match[1] === 'warmup') warmup = count;
  else iterations = count;
}

const [gameArg, ...charArgs] = positional;
if (!gameArg || charArgs.length === 0) {
  console.error(usage);
  process.exit(1);
}

const server = await createServer({
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { runTeamRotation, summarizeRun } = await server.ssrLoadModule('/tests/helpers/runTeamRotation.js');
  const { runRotation } = await server.ssrLoadModule('/src/workers/simulation/rotation/index.js');
  const initial = runTeamRotation(gameArg, charArgs);
  const summary = summarizeRun(initial);
  const equipMaps = {};

  const warmupStart = performance.now();
  for (let i = 0; i < warmup; i++) {
    runRotation(initial.cache, equipMaps);
  }
  const warmupDuration = performance.now() - warmupStart;

  if (warmup > 0) {
    const estimatedSeconds = warmupDuration / warmup * iterations / 1000;
    console.log(`Est. time for ${iterations} measured rotations: ${estimatedSeconds.toFixed(3)} s (based on ${warmup} warmup rotations)`);
  } else {
    console.log('Est. time unavailable: warmup is disabled.');
  }

  const durations = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    runRotation(initial.cache, equipMaps);
    durations.push(performance.now() - start);
  }

  const average = durations.reduce((sum, duration) => sum + duration, 0) / iterations;
  durations.sort((a, b) => a - b);
  const median = iterations % 2
    ? durations[Math.floor(iterations / 2)]
    : (durations[iterations / 2 - 1] + durations[iterations / 2]) / 2;
  const p95 = durations[Math.ceil(iterations * 0.95) - 1];

  console.log(`\n${summary.order.map(({ name }) => name).join(' -> ')}`);
  console.log(`Snapshots: ${summary.snapshots.length}; Totals:`, summary.totals);
  console.log(`\np50: ${median.toFixed(3)} ms`);
  console.log(`p95: ${p95.toFixed(3)} ms`);
  console.log(`Range: ${durations[0].toFixed(3)} - ${durations[iterations - 1].toFixed(3)} ms`);
  console.log(`\n100 Rotations: ${(average * 100 / 1000).toFixed(3)} s`);
  console.log(`250 Rotations: ${(average * 250 / 1000).toFixed(3)} s`);
  console.log(`500 Rotations: ${(average * 500 / 1000).toFixed(3)} s\n`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await server.close();
}
