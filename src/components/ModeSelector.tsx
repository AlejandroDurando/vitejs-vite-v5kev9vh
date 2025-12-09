import { Tag, Car } from 'lucide-react';
import type { SearchMode, CodigoCategory } from '../types';

interface ModeSelectorProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  category?: CodigoCategory;
  onCategoryChange: (category?: CodigoCategory) => void;
}

const CATEGORIES: { value: CodigoCategory; label: string }[] = [
  { value: 'SUCURSALES', label: 'Sucursales' },
  { value: 'AGENCIAS', label: 'Agencias' },
  { value: 'COMPRAS', label: 'Compras' },
  { value: 'MOVILIDADES', label: 'Movilidades' },
];

export function ModeSelector({ mode, onModeChange, category, onCategoryChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
      <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg backdrop-blur-sm">
        <button
          onClick={() => onModeChange('CODIGOS')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            mode === 'CODIGOS'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Tag className="w-4 h-4" />
          Códigos
        </button>
        <button
          onClick={() => onModeChange('MATRICULAS')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            mode === 'MATRICULAS'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Car className="w-4 h-4" />
          Matrículas
        </button>
      </div>

      {mode === 'CODIGOS' && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !category
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                category === value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
