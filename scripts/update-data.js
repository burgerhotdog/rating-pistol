import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInput, enterIds } from './input';
import { fetchJson, saveData, saveVersion } from './io';

const game = process.argv[2];

if(!['gi','hsr','ww','zzz'].includes(game) || process.argv.length !== 3) {
  console.error('Usage: node scripts/update-data.js <gi|hsr|ww|zzz>');
  process.exitCode = 1;
} else {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const rl = createInput();
  try {
    const manifest = await fetchJson('https://static.nanoka.cc/manifest.json');
    const version = manifest[game].live;

    const kinds = [
      'character',
      'weapon',
      'set',
      ...(game === 'ww' ? ['echo']:[])
    ];

    const groups = [];

    for (const type of kinds) {
      groups.push([type, await enterIds(rl, game, version, type)]);
    }

    console.log(`\nVersion ${version} update summary`);

    for (const [type, items] of groups) {
      if (!items.length) continue;

      console.log(`New ${type === 'echo' ? 'echoes' : `${type}s`}: ${items.map(([, ,data]) => data.name).join(', ')}`);
    }

    console.log();

    let answer;

    do {
      answer = await rl.question('Continue? (y/n): ');
      if(!['y', 'n'].includes(answer)){
        console.log('Invalid input. Please try again.');
      }
    } while (!['y', 'n'].includes(answer));

    if (answer === 'n') {
      console.log('Update cancelled.');
    } else {
      console.log();

      for (const [type, items] of groups) {
        if (!items.length) continue;
        await saveData(root,game,type,items);
      }

      await saveVersion(root, game, version.split('+')[0]);
      console.log('Update complete');
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}
