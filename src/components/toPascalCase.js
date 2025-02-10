const toPascalCase = (str) =>
  str
    .replace(/'s\b/gi, "s") // Replace possessive 's with s
    .match(/[a-z0-9]+/gi) // Match alphabetic and numeric substrings
    ?.map(word =>
      /^[0-9]/.test(word) // If word starts with a number, keep it as is
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // PascalCase for alphabetic substrings
    )
    .join('') || ''; // Handle cases where match() returns null

export default toPascalCase;
