import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {gameIds} from './common.js';
export async function fetchOk(url){const response=await fetch(url);if(!response.ok)throw new Error(`HTTP ${response.status}: ${url}`);return response;}
export async function fetchJson(url){return (await fetchOk(url)).json();}
const readJson=async p=>JSON.parse(await readFile(p,'utf8'));
async function writeJson(p,data){const temp=`${p}.tmp`;await writeFile(temp,JSON.stringify(data,null,2));await rename(temp,p);}
function merge(current,next){for(const [key,val] of Object.entries(next)){const old=current[key];if(old===undefined||old===null||val===null||typeof old!==typeof val||Array.isArray(old)!==Array.isArray(val)){current[key]=val;}else if(Array.isArray(val)){old.push(...val);}else if(typeof val==='object'){merge(old,val);}else current[key]=val;}return current;}
export async function saveData(root,game,type,items){const name=gameIds[game],file=path.join(root,'src/data',name,`${type}.json`),data=await readJson(file);for(const [id,image,entry] of items){const img=path.join(root,'public',name,type,`${id}.webp`);await mkdir(path.dirname(img),{recursive:true});await writeFile(img,image);data[id]=merge(data[id]??{},entry);}const sorted=Object.fromEntries(Object.entries(data).sort(([a],[b])=>Number(a)-Number(b)));await writeJson(file,sorted);}
export async function saveVersion(root,game,version){const file=path.join(root,'src/data/version.json'),data=await readJson(file);data[gameIds[game]]=String(version);await writeJson(file,data);}
