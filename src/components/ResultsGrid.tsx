import { SearchX } from 'lucide-react';
import { ResultCard } from './ResultCard';
import type { SearchResult } from '../types';

interface ResultsGridProps {
  results: SearchResult[];
  searchTerm: string;
}

export function ResultsGrid({ results, searchTerm }: ResultsGridProps) {
  if (!searchTerm.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <SearchX className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">Ingrese un término de búsqueda</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <SearchX className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">No se encontraron resultados</p>
        <p className="text-sm mt-2">Intente con otros términos de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-gray-400">
        {results.length} {results.length === 1 ? 'resultado' : 'resultados'} encontrado{results.length === 1 ? '' : 's'}
      </div>
      <div className="grid gap-4">
        {results.map((result, index) => (
          <ResultCard key={index} result={result} searchTerm={searchTerm} />
        ))}
      </div>
    </div>
  );
}
