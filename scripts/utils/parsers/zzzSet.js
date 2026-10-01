export function zzzSet(id, data) {
  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `zenless-zone-zero/set/${id}.webp`,
    bonuses: [2, 4],
    halfStat: '',
    effects: [],
  };
}
