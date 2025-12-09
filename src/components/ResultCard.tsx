import { Hash, FileText, Car, Package, Star } from 'lucide-react';
import type { SearchResult, CodigoItem, MatriculaItem } from '../types';
import { highlightMatch } from '../utils/textUtils';

interface ResultCardProps {
  result: SearchResult;
  searchTerm: string;
}

function isCodigoItem(item: CodigoItem | MatriculaItem): item is CodigoItem {
  return 'CODIGO' in item;
}

export function ResultCard({ result, searchTerm }: ResultCardProps) {
  const { item, matchType } = result;

  if (isCodigoItem(item)) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-emerald-500 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${matchType === 'keyword' ? 'bg-yellow-500/20' : 'bg-emerald-500/20'}`}>
            {matchType === 'keyword' ? (
              <Star className="w-6 h-6 text-yellow-400" />
            ) : (
              <Hash className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {matchType === 'keyword' && (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-900 bg-yellow-400 rounded mb-2">
                Key Match
              </span>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-white">{item.CODIGO}</span>
              <span className="px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/20 rounded">
                {item.CATEGORIA}
              </span>
            </div>
            <p
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightMatch(item.DESCRIPCION, searchTerm),
              }}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-emerald-500 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-500/20">
            <Car className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-white">{item.MATRICULA}</span>
            </div>
            <p
              className="text-gray-300 mb-3 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightMatch(item.MATERIAL, searchTerm),
              }}
            />
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">{item.BIEN_DE_USO}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
