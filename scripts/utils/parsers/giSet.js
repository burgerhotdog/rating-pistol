export function giSet(id, data) {
  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `genshin-impact/set/${id}.webp`,
    bonuses: [2, 4],
    halfStat: '',
    effects: [],
  };
}
