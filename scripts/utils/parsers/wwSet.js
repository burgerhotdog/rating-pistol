export function wwSet(id, data) {
  return {
    disabled: true,
    name: String(data.name.en),
    version: null,
    id: Number(id),
    icon: `wuthering-waves/set/${id}.webp`,
    bonuses: Object.keys(data.set ?? {}),
    halfStat: '',
    effects: [],
  };
}
