export function parseSet(id, data) {
  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `honkai-star-rail/set/${id}.webp`,
    bonuses: Object.keys(data.require_num ?? {}),
    halfStat: '',
    effects: [],
  };
}
