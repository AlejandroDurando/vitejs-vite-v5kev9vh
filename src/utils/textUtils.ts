export function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalize(text: string): string {
  return stripAccents(text.toLowerCase().trim());
}

export function highlightMatch(text: string, searchTerm: string): string {
  if (!searchTerm) return text;

  const normalizedText = normalize(text);
  const normalizedSearch = normalize(searchTerm);

  const index = normalizedText.indexOf(normalizedSearch);
  if (index === -1) return text;

  const before = text.substring(0, index);
  const match = text.substring(index, index + searchTerm.length);
  const after = text.substring(index + searchTerm.length);

  return `${before}<mark class="bg-yellow-400 text-gray-900 font-semibold px-1 rounded">${match}</mark>${after}`;
}
