export function formatRotation(id, rotation) {
  if (!rotation) throw new Error('attempting to format undefined rotation');
  return rotation.map(key => {
    if (key.split('-').length === 3) return key;
    return `${id}-${key}`;
  });
}
