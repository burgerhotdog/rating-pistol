import {
  weaponNameToId,
  mainStatNameToIdByCost,
  subStatValueOptionsById,
} from '@/workers/ocr/helpers/maps';

export const weaponIdToName = Object.fromEntries(
  Object.entries(weaponNameToId).map(([name, id]) => [id, name])
);

export const mainStatIdToNameByCost = Object.fromEntries(
  Object.entries(mainStatNameToIdByCost).map(([cost, nameToId]) => [
    cost,
    Object.fromEntries(Object.entries(nameToId).map(([name, id]) => [id, name])),
  ])
);

export const subStatIds = Object.keys(subStatValueOptionsById);

export const createBlankEquip = () => ({
  subStatList: Array.from({ length: 5 }, () => ({ subStatId: '', subStatValue: null })),
});

export const createBlankBuild = () => ({
  rank: null,
  weaponId: '',
  equipList: Array.from({ length: 5 }, createBlankEquip),
});
