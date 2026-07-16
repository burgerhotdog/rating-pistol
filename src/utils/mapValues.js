export const mapValues = (obj, fn) => {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = fn(value, key);
  }

  return result;
};
