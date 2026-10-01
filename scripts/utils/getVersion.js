import { fetchJson } from './fetch.js';

const url = 'https://static.nanoka.cc/manifest.json';

export async function getVersion(gameCode) {
  const manifest = await fetchJson(url);
  return manifest[gameCode].live;
}
