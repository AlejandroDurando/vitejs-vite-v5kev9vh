export type SearchMode = 'CODIGOS' | 'MATRICULAS';

export type CodigoCategory = 'SUCURSALES' | 'AGENCIAS' | 'COMPRAS' | 'MOVILIDADES';

export interface CodigoItem {
  CODIGO: string;
  DESCRIPCION: string;
  CATEGORIA: CodigoCategory;
}

export interface MatriculaItem {
  MATRICULA: string;
  MATERIAL: string;
  BIEN_DE_USO: string;
}

export interface SearchResult {
  item: CodigoItem | MatriculaItem;
  matchType: 'keyword' | 'text';
  matchedFields: string[];
  highlightedText?: string;
}
