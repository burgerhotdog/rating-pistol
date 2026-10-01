import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { getVersion } from './utils/getVersion.js';
import { enterIds } from './utils/input.js';
import { saveData, saveVersion } from './utils/io.js';

const gameCodes = ['gi', 'hsr', 'ww', 'zzz'];

async function pickGame(rl) {
  while (true) {
    const game = await rl.question('Game (gi/hsr/ww/zzz): ');

    if (gameCodes.includes(game)) {
      return game;
    }

    console.log('Invalid input. Please try again.');
  }
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const gameCode = await pickGame(rl);
    const version = await getVersion(gameCode);

    const groups = [];
    groups.push(['character', await enterIds(rl, gameCode, version, 'character')]);
    groups.push(['weapon', await enterIds(rl, gameCode, version, 'weapon')]);
    groups.push(['set', await enterIds(rl, gameCode, version, 'set')]);
    if (gameCode === 'ww') {
      groups.push(['echo', await enterIds(rl, gameCode, version, 'echo')]);
    }

    console.log(`\nVersion ${version} update summary`);

    for (const [type, items] of groups) {
      if (!items.length) continue;

      console.log(`New ${type === 'echo' ? 'echoes' : `${type}s`}: ${items.map(([, , data]) => data.name).join(', ')}`);
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
        await saveData(root, gameCode, type, items);
      }

      await saveVersion(root, gameCode, version.split('+')[0]);
      console.log('Update complete');
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

await main();
