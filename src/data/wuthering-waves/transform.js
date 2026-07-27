#!/usr/bin/env node
/**
 * Transforms a JSON file of character skill data.
 *
 * For every action object found inside any "actions" array, if the action
 * has a "damage", "healing", or "shield" field, its value (the array) is
 * wrapped like this:
 *
 *   Before:
 *     "damage": [ { "mv": [...] } ]
 *
 *   After:
 *     "damage": {
 *       "multipliers": {
 *         "damage": [ { "mv": [...] } ]
 *       }
 *     }
 *
 * Usage:
 *   node transform.js [filename.json]
 *
 * If no filename is given, the script looks for a single .json file in the
 * same directory as the script and uses that. Output is written in place
 * (a .bak backup of the original is created first).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIELDS_TO_WRAP = ['damage', 'healing', 'shield'];

function resolveInputFile() {
  const argPath = process.argv[2];
  const dir = __dirname;

  if (argPath) {
    return path.isAbsolute(argPath) ? argPath : path.join(dir, argPath);
  }

  const jsonFiles = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.error(`No .json file found in ${dir}. Pass a filename as an argument.`);
    process.exit(1);
  }
  if (jsonFiles.length > 1) {
    console.error(
      `Multiple .json files found in ${dir}:\n  ${jsonFiles.join('\n  ')}\n` +
      `Please specify which one to use: node transform.js <filename.json>`
    );
    process.exit(1);
  }

  return path.join(dir, jsonFiles[0]);
}

const fieldTypes = ['damage', 'healing', 'shield'];

function transformAction(action) {
  if (!action || typeof action !== 'object') return;
  if (!action.attr) return;
  const attr = action.attr;
  delete action.attr;
  for (const fieldType of fieldTypes) {
    if (!action[fieldType]) continue;

    const prev = action[fieldType];
    action[fieldType] = { attr, ...prev };
  }
}

function walk(node) {
  if (Array.isArray(node)) {
    for (const item of node) walk(item);
    return;
  }

  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (key === 'actions' && Array.isArray(node[key])) {
        for (const action of node[key]) {
          transformAction(action);
          // Still walk into the action in case of nested structures
          walk(action);
        }
      } else {
        walk(node[key]);
      }
    }
  }
}

function main() {
  const inputFile = resolveInputFile();
  console.log(`Reading: ${inputFile}`);

  const raw = fs.readFileSync(inputFile, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse JSON: ${err.message}`);
    process.exit(1);
  }

  walk(data);

  const backupFile = inputFile + '.bak';
  fs.writeFileSync(backupFile, raw, 'utf8');
  console.log(`Backup written to: ${backupFile}`);

  fs.writeFileSync(inputFile, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Transformed JSON written to: ${inputFile}`);
}

main();