export const toArray = (unknown) => {
  if (Array.isArray(unknown)) return unknown;
  if (unknown == null) return [];
  return [unknown];
};
