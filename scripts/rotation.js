import { createServer } from 'vite';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const [gameArg, ...charArgs] = process.argv.slice(2);

if (!gameArg || charArgs.length === 0) {
  console.error('Usage: npm run rotation -- <game> <char> <char> ...');
  process.exit(1);
}

const server = await createServer({
  server: { middlewareMode: true, watch: null },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { runTeamRotation, summarizeRun } = await server.ssrLoadModule('/tests/helpers/runTeamRotation.js');
  const summary = summarizeRun(runTeamRotation(gameArg, charArgs));

  console.log(`${summary.gameId}: ${summary.order.map(({ name }) => name).join(' -> ')}`);
  console.log('runtime'.padStart(8), 'owner'.padEnd(16), 'action'.padEnd(28), 'damage'.padStart(10), 'heal'.padStart(8), 'shield'.padStart(8));
  for (const s of summary.snapshots) {
    console.log(
      String(s.runtime).padStart(8),
      s.owner.padEnd(16),
      String(s.name ?? s.key).slice(0, 28).padEnd(28),
      String(Math.round(s.damage ?? 0)).padStart(10),
      String(Math.round(s.healing ?? 0)).padStart(8),
      String(Math.round(s.shield ?? 0)).padStart(8),
    );
  }
  console.log('totals', summary.totals);

  const outFile = path.join('rotation-output', `${summary.gameId}-${summary.order.map(({ id }) => id).join('-')}.json`);
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(summary, null, 2));
  console.log(`Saved ${outFile}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await server.close();
}
