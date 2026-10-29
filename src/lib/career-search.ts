export function matchesCareer(title: string, query: string) {
  const words = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  const titleWords = words(title);
  return words(query).every((word) => titleWords.some((part) => part.startsWith(word)));
}
