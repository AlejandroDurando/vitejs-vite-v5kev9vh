import { useState, useEffect, useMemo } from 'react';
import { Search, Copy, Check, Eye, EyeOff, FileText, LayoutGrid } from 'lucide-react';
import { fetchData } from './services/dataFetcher';
import { DisposicionViewer } from './components/DisposicionViewer';

function App() {
  const [view, setView] = useState<'SEARCH' | 'DOCS'>('SEARCH');
  const [docYear, setDocYear] = useState(2025);

  const [mode, setMode] = useState<'CODIGOS' | 'MATRICULAS'>('CODIGOS');
  const [category, setCategory] = useState('SUCURSALES');
  const [query, setQuery] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Carga inicial de Palabras Clave
  useEffect(() => {
    fetchData('PALABRAS_CLAVE').then((res: any) => {
      setKeywords(res);
    }).catch(err => console.error(err));
  }, []);

  // Carga de datos al cambiar categoría
  useEffect(() => {
    if (view === 'DOCS') return;
    
    setShowAll(false); 
    setQuery('');
    
    const targetCategory = mode === 'MATRICULAS' ? 'MATRICULAS' : category;
    setLoading(true);
    fetchData(targetCategory).then((res: any) => {
      setData(res);
      setLoading(false);
    });
  }, [category, mode, view]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- LÓGICA DE FILTRADO OPTIMIZADA (Para que no se tilde la PC) ---
  const filteredData = useMemo(() => {
    if (!query && !showAll) return [];
    if (!query && showAll) return data; 

    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // 1. Buscamos códigos relacionados en Palabras Clave (Pre-cálculo)
    let targetCodesFromKeywords: string[] = [];
    if (mode === 'CODIGOS' && q.length > 2 && keywords.length > 0) {
        const sampleKey = keywords[0];
        const wordKey = Object.keys(sampleKey).find(k => k.includes('PALABRA') || k.includes('HERRAMIENTA')) || 'PALABRA';
        const codeKey = Object.keys(sampleKey).find(k => k.includes('CODIGO')) || 'CODIGO';

        targetCodesFromKeywords = keywords
            .filter(k => {
                const val = (k[wordKey] || '').toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return val.includes(q);
            })
            .map(k => (k[codeKey] || '').toString());
    }

    // 2. Filtrado rápido
    return data.filter((item) => {
      const getVal = (val: any) => (val || '').toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (mode === 'MATRICULAS') {
        return getVal(item.MATRICULA).includes(q) || getVal(item.MATERIAL).includes(q);
      } else {
        if (getVal(item.CODIGO).includes(q) || getVal(item.DESCRIPCION).includes(q)) return true;
        if (targetCodesFromKeywords.length > 0) {
            return targetCodesFromKeywords.includes((item.CODIGO || '').toString());
        }
        return false;
      }
    });
  }, [data, query, showAll, mode, keywords]);

  // Límite de renderizado: Mostramos hasta 100 resultados (en PC aguantan bien)
  const dataToRender = filteredData.slice(0, 100); 

  const HighlightText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!text) return null;
    if (!highlight || highlight.length < 2) return <>{text}</>;
    try {
        const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
        const parts = text.toString().split(pattern);
        return (
        <span>
            {parts.map((part, i) => 
            part.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === highlight.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ? (
                <span key={i} className="text-blue-400 font-extrabold bg-blue-500/20 px-0.5 rounded shadow-[0_0_10px_rgba(59,130,246,0.2)]">{part}</span>
            ) : (part)
            )}
        </span>
        );
    } catch (e) {
        return <>{text}</>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#1e3a8a] flex flex-col items-center p-4 font-sans text-white">
      
      {/* CAMBIO PC: Ancho máximo aumentado a 6xl para aprovechar el monitor */}
      <div className="w-full max-w-6xl bg-[#0B1120] rounded-xl shadow-lg border border-slate-700 p-2 mb-4 flex justify-between items-center sticky top-4 z-50 backdrop-blur-md bg-opacity-95">
        <div className="flex gap-2">
          <button 
            onClick={() => setView('SEARCH')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'SEARCH' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Search className="w-4 h-4" />
            Buscador
          </button>
          <button 
            onClick={() => setView('DOCS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'DOCS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <FileText className="w-4 h-4" />
            Disposición
          </button>
        </div>

        {view === 'DOCS' && (
          <select 
            value={docYear}
            onChange={(e) => setDocYear(Number(e.target.value))}
            className="bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-1 focus:outline-none focus:border-blue-400"
          >
            <option value={2025}>2025</option>
            <option value={2026} disabled>2026 (Próx)</option>
          </select>
        )}
      </div>

      {/* CAMBIO PC: Contenedor más ancho */}
      <div className="w-full max-w-6xl bg-[#0B1120] rounded-2xl shadow-2xl overflow-hidden border border-slate-700 min-h-[600px]">
        
        {view === 'SEARCH' && (
          <>
            <div className="p-8 pb-4">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-6">
                <Search className="w-8 h-8 text-blue-400" />
                Buscador de códigos y matrículas
              </h1>

              <div className="flex bg-slate-800 p-1 rounded-lg mb-6 max-w-md"> {/* Limitado el ancho de los botones */}
                <button onClick={() => setMode('CODIGOS')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'CODIGOS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>CÓDIGOS</button>
                <button onClick={() => setMode('MATRICULAS')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'MATRICULAS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>MATRÍCULAS</button>
              </div>

              {mode === 'CODIGOS' && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {['SUCURSALES', 'AGENCIAS', 'COMPRAS', 'MOVILIDADES'].map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${category === cat ? 'bg-blue-500/20 border-blue-400 text-blue-400' : 'border-slate-600 text-slate-400 hover:border-slate-400'}`}>{cat}</button>
                  ))}
                </div>
              )}

              <div className="relative text-black mb-4">
                <input 
                  type="text" 
                  placeholder="Escribe una palabra o un codigo" 
                  className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-400 transition-all placeholder:text-slate-500" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />
                <Search className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => setShowAll(!showAll)}
                  className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${showAll ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                >
                  {showAll ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showAll ? 'Ocultar listado completo' : 'Mostrar todo el listado'}
                </button>
              </div>
            </div>

            <div className="bg-[#0f1623] min-h-[400px] max-h-[600px] overflow-y-auto p-4 border-t border-slate-800">
              {loading ? <div className="text-center text-slate-500 py-10 animate-pulse">Cargando datos...</div> : 
               dataToRender.length > 0 ? (
                
                // CAMBIO PC: Aquí usamos CSS GRID para mostrar varias columnas en pantallas grandes
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {dataToRender.map((item, idx) => {
                    const codeValue = mode === 'MATRICULAS' ? item.MATRICULA : item.CODIGO;
                    return (
                      <div key={idx} className="relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-blue-500/50 transition-colors group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-blue-400 font-bold text-lg flex items-center gap-2">
                              {/* Texto simplificado para PC */}
                              <span className="text-xs text-slate-500 font-normal uppercase tracking-wider border border-slate-700 px-1 rounded">{mode === 'CODIGOS' ? 'COD' : 'MAT'}</span>
                              <HighlightText text={codeValue} highlight={query} />
                            </h3>
                            {mode === 'MATRICULAS' && (
                            <button 
                              onClick={() => copyToClipboard(codeValue, idx)}
                              className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95"
                              title="Copiar número"
                            >
                              {copiedId === idx ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                        
                        <p className="text-slate-300 text-sm leading-relaxed flex-1">
                            <HighlightText text={mode === 'MATRICULAS' ? item.MATERIAL : item.DESCRIPCION} highlight={query} />
                        </p>
                        
                        {item.BIEN_DE_USO && (
                            <div className="mt-3 pt-3 border-t border-slate-700/30">
                                <span className="text-[10px] font-bold tracking-wider bg-slate-900 text-slate-500 px-2 py-1 rounded inline-block border border-slate-700">
                                {item.BIEN_DE_USO}
                                </span>
                            </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                    {query ? (
                        <>
                            <Search className="w-12 h-12 mb-2 opacity-20" />
                            <p>No se encontraron resultados para "{query}"</p>
                        </>
                    ) : (
                        <>
                            <LayoutGrid className="w-12 h-12 mb-2 opacity-20" />
                            <p>Escribe para buscar o activa "Mostrar todo"</p>
                        </>
                    )}
                  </div>}
              
              {/* AVISO SI HAY MÁS RESULTADOS */}
              {filteredData.length > 100 && (
                <div className="text-center py-4 text-xs text-slate-500 border-t border-slate-800 mt-4">
                    Mostrando 100 de {filteredData.length} resultados. Escribe más para filtrar mejor.
                </div>
              )}
            </div>
          </>
        )}

        {view === 'DOCS' && (
          <div className="p-4 bg-[#0f1623] min-h-[600px]">
            <DisposicionViewer year={docYear} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;