import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import path from 'node:path';

const gameCodeToId = {
  gi: 'genshin-impact',
  hsr: 'honkai-star-rail',
  ww: 'wuthering-waves',
  zzz: 'zenless-zone-zero',
};

export const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'));

export async function writeJson(p, data) {
  const temp = `${p}.tmp`;

  const json = JSON.stringify(data, null, 2)
    .replace(/"version": (\d+)(?=[,\n])/g, '"version": $1.0');

  await writeFile(temp, json);
  await rename(temp, p);
}

function merge(current, next) {
  for (const [key, val] of Object.entries(next)) {
    const old = current[key];
    if (
      old === undefined ||
      old === null ||
      val === null ||
      typeof old !== typeof val ||
      Array.isArray(old) !== Array.isArray(val)
    ) {
      current[key] = val;
    } else if (Array.isArray(val)) {
      old.push(...val);
    } else if (typeof val === 'object') {
      merge(old, val);
    } else {
      current[key] = val;
    }
  }

  return current;
}

export async function saveData(root, game, type, items) {
  const name = gameCodeToId[game];
  const file = path.join(root, 'src/data', name, `${type}.json`);
  const data = await readJson(file);

  for (const [id, image, entry] of items) {
    const img = path.join(root, 'public', name, type, `${id}.webp`);
    await mkdir(path.dirname(img), { recursive: true });
    await writeFile(img, image);
    data[id] = merge(data[id] ?? {}, entry);
  }

  const sorted = Object.fromEntries(
    Object.entries(data).sort(([a], [b]) => Number(a) - Number(b))
  );

  await writeJson(file, sorted);
}

export async function saveVersion(root, gameCode, version) {
  const gameId = gameCodeToId[gameCode];
  const filepath = path.join(root, 'src/data/version.json');

  const data = await readJson(filepath);

  data[gameId] = String(version);

  await writeJson(filepath, data);
}
