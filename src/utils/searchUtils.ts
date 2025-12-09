import { normalize } from './textUtils';
import { KEYWORD_MAP } from '../data/keywordMap';
import type { CodigoItem, MatriculaItem, SearchResult, CodigoCategory } from '../types';

export function findKeywordMatch(searchTerm: string): string | null {
  const normalizedSearch = normalize(searchTerm);

  for (const [keyword, code] of Object.entries(KEYWORD_MAP)) {
    if (normalize(keyword).includes(normalizedSearch) || normalizedSearch.includes(normalize(keyword))) {
      return code;
    }
  }

  return null;
}

export function searchCodigos(
  data: CodigoItem[],
  searchTerm: string,
  category?: CodigoCategory
): SearchResult[] {
  if (!searchTerm.trim()) return [];

  const normalizedSearch = normalize(searchTerm);
  const results: SearchResult[] = [];

  const keywordCode = findKeywordMatch(searchTerm);

  const filteredData = category
    ? data.filter(item => item.CATEGORIA === category)
    : data;

  for (const item of filteredData) {
    const matchedFields: string[] = [];
    const normalizedCodigo = normalize(item.CODIGO);
    const normalizedDesc = normalize(item.DESCRIPCION);

    if (keywordCode && item.CODIGO === keywordCode) {
      results.unshift({
        item,
        matchType: 'keyword',
        matchedFields: ['CODIGO'],
      });
      continue;
    }

    if (normalizedCodigo.includes(normalizedSearch)) {
      matchedFields.push('CODIGO');
    }

    if (normalizedDesc.includes(normalizedSearch)) {
      matchedFields.push('DESCRIPCION');
    }

    if (matchedFields.length > 0) {
      results.push({
        item,
        matchType: 'text',
        matchedFields,
      });
    }
  }

  return results;
}

export function searchMatriculas(
  data: MatriculaItem[],
  searchTerm: string
): SearchResult[] {
  if (!searchTerm.trim()) return [];

  const normalizedSearch = normalize(searchTerm);
  const results: SearchResult[] = [];

  for (const item of data) {
    const matchedFields: string[] = [];
    const normalizedMatricula = normalize(item.MATRICULA);
    const normalizedMaterial = normalize(item.MATERIAL);

    if (normalizedMatricula.includes(normalizedSearch)) {
      matchedFields.push('MATRICULA');
    }

    if (normalizedMaterial.includes(normalizedSearch)) {
      matchedFields.push('MATERIAL');
    }

    if (matchedFields.length > 0) {
      results.push({
        item,
        matchType: 'text',
        matchedFields,
      });
    }
  }

  return results;
}
