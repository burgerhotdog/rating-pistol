import {
  weaponNameToId,
  mainstatNameToIdByCost,
  valueOptionsById,
} from '@/workers/ocr/helpers/maps';

export const weaponIdToName = Object.fromEntries(
  Object.entries(weaponNameToId).map(([name, id]) => [id, name])
);

export const mainstatIdToNameByCost = Object.fromEntries(
  Object.entries(mainstatNameToIdByCost).map(([cost, nameToId]) => [
    cost,
    Object.fromEntries(Object.entries(nameToId).map(([name, id]) => [id, name])),
  ])
);

export const stats = Object.keys(valueOptionsById);

export const createBlankEquip = () => ({
  substats: Array.from({ length: 5 }, () => ({ id: '', value: null })),
});

export const createBlankBuild = () => ({
  rank: null,
  weaponId: '',
  equipList: Array.from({ length: 5 }, createBlankEquip),
});
