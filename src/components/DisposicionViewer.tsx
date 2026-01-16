import { useState, useEffect } from 'react';
import { FileText, Search, Users, CreditCard, ChevronDown, ChevronRight, Link as LinkIcon, Table } from 'lucide-react';
import { DISPOSICIONES } from '../data/disposicionData';

// --- DEFINICIÓN DE TIPOS ---
// Definimos manualmente qué forma tienen nuestros datos para que TypeScript no se queje.
interface AnexoItem {
  codigo: number | string;
  descripcion: string;
}

interface Anexo {
  id: string;
  titulo: string;
  items: AnexoItem[];
}

interface Articulo {
  numero: number;
  titulo: string;
  contenido: string[];
}

interface Responsable {
  nombre: string;
  legajo: string;
  dni: string;
}

interface Fondo {
  numero: string;
  nombre: string;
  monto: string;
  cuenta: string;
  responsables: Responsable[];
}

// Esta es la estructura maestra. El signo ? en anexos indica que es opcional.
interface DisposicionData {
  titulo: string;
  subtitulo: string;
  fecha: string;
  visto: string;
  considerando: string[];
  articulos: Articulo[];
  fondos: Fondo[];
  anexos?: Anexo[]; 
}

// --- COMPONENTES AUXILIARES ---

// 1. Detectar enlaces en el texto
const TextWithLinks = ({ text, onLinkClick }: { text: string, onLinkClick: (target: string) => void }) => {
  const parts = text.split(/(anexo\s+[ivx]+)/gi);
  return (
    <>
      {parts.map((part, i) => {
        if (part.toLowerCase().startsWith('anexo')) {
           return (
             <span 
               key={i} 
               onClick={(e) => { e.stopPropagation(); onLinkClick(part); }} 
               className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-bold transition-colors inline-flex items-center gap-0.5"
               title="Ver Anexo"
             >
               {part} <LinkIcon className="w-3 h-3" />
             </span>
           );
        }
        return part;
      })}
    </>
  );
};

// 2. Acordeón de Artículos
const ArticleAccordion = ({ articulo, onLinkClick }: { articulo: Articulo, onLinkClick: (t: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`border rounded-lg overflow-hidden bg-slate-800 transition-all ${isOpen ? 'border-blue-500/30' : 'border-slate-700 hover:border-slate-600'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <span className="font-bold text-blue-400 whitespace-nowrap">ARTÍCULO {articulo.numero}°</span>
          <span className="text-white font-medium opacity-90 md:border-l md:border-slate-600 md:pl-3">{articulo.titulo}</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
      </button>
      {isOpen && (
        <div className="p-4 pt-2 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 animate-fade-in bg-slate-900/30">
          <div className="space-y-3">
            {articulo.contenido.map((parrafo, idx) => (
              <p key={idx} className={`${parrafo.match(/^\d+[).]/) || parrafo.startsWith('•') ? 'pl-4 border-l-2 border-slate-700' : ''}`}>
                <TextWithLinks text={parrafo} onLinkClick={onLinkClick} />
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export function DisposicionViewer({ year }: { year: number }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'NORMATIVAS' | 'FONDOS' | 'ANEXOS'>('FONDOS');
  
  // OBTENCIÓN DE DATOS Y CASTING
  const rawData = DISPOSICIONES[year as keyof typeof DISPOSICIONES];
  
  // Si no hay datos, mostrar error
  if (!rawData) return <div className="text-center p-10 text-slate-400">No hay disposición cargada para el año {year}</div>;

  // Forzamos a TypeScript a tratar 'rawData' como nuestra interfaz 'DisposicionData'
  const data = rawData as unknown as DisposicionData;

  // Filtrado de fondos
  const filteredFondos = data.fondos ? data.fondos.filter(f => 
    f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.responsables.some(r => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  // Manejador de click en links
  const handleLinkClick = (target: string) => {
    console.log("Navegando a:", target);
    setActiveTab('ANEXOS');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 mb-6 border border-slate-700 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-500/20 hidden sm:block">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{data.titulo}</h2>
            <p className="text-blue-400 font-medium text-xs sm:text-sm">{data.subtitulo}</p>
            <p className="text-slate-500 text-xs mt-1">{data.fecha}</p>
          </div>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-2 z-10 bg-[#0f1623]/95 p-2 rounded-xl backdrop-blur shadow-xl border border-slate-800/50">
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => setActiveTab('FONDOS')} 
            className={`flex-1 md:flex-none px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'FONDOS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Fondos
          </button>
          <button 
            onClick={() => setActiveTab('NORMATIVAS')} 
            className={`flex-1 md:flex-none px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'NORMATIVAS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Legal
          </button>
          
          {/* Renderizado condicional del botón Anexos */}
          {data.anexos && data.anexos.length > 0 && (
            <button 
              onClick={() => setActiveTab('ANEXOS')} 
              className={`flex-1 md:flex-none px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 justify-center ${activeTab === 'ANEXOS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
               <Table className="w-3 h-3" /> Anexos
            </button>
          )}
        </div>

        {/* Barra de búsqueda (Solo visible en Fondos) */}
        {activeTab === 'FONDOS' && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar fondo o responsable..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-blue-400 focus:outline-none transition-colors text-sm" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        )}
      </div>

      {/* --- CONTENIDO DE LAS PESTAÑAS --- */}

      {/* 1. Pestaña FONDOS */}
      {activeTab === 'FONDOS' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {filteredFondos.map((fondo, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all shadow-lg group">
              <div className="p-4 border-b border-slate-700 bg-slate-900/30 group-hover:bg-slate-900/50 transition-colors">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded tracking-wider self-start">FONDO #{fondo.numero}</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)] self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-[10px] text-blue-400/60 uppercase font-semibold tracking-wider mr-1">Monto</span>
                    <span className="text-blue-400 font-bold font-mono text-lg tracking-tight">{fondo.monto}</span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mt-1">{fondo.nombre}</h3>
                <div className="flex items-center gap-2 mt-3 text-slate-400 text-xs">
                  <CreditCard className="w-3 h-3 text-blue-400" />
                  <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-500">{fondo.cuenta}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users className="w-3 h-3" /> Responsables
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {fondo.responsables.map((resp, rIdx) => (
                    <div key={rIdx} className="flex justify-between items-center text-sm p-2 rounded bg-slate-900/40 border border-slate-700/50 hover:bg-slate-900/80 transition-colors">
                      <div>
                        <div className="text-slate-200 font-medium">{resp.nombre}</div>
                        <div className="text-[10px] text-slate-500">DNI: {resp.dni}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-white bg-white/10 px-2 py-1 rounded border border-white/10 shadow-sm">L: {resp.legajo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Pestaña NORMATIVAS */}
      {activeTab === 'NORMATIVAS' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-xl">
            <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2 text-sm sm:text-base">
              <FileText className="w-4 h-4" /> VISTO Y CONSIDERANDO
            </h3>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed text-justify border-l-2 border-slate-700 pl-4">{data.visto}</p>
            <ul className="space-y-3">
              {data.considerando.map((cons, i) => (
                <li key={i} className="text-slate-400 text-sm flex gap-3">
                  <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" />
                  {cons}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            {data.articulos.map((art, i) => (
              <ArticleAccordion key={i} articulo={art} onLinkClick={handleLinkClick} />
            ))}
          </div>
        </div>
      )}

      {/* 3. Pestaña ANEXOS */}
      {activeTab === 'ANEXOS' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          {data.anexos && data.anexos.length > 0 ? (
            data.anexos.map((anexo, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded text-blue-400">
                    <Table className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{anexo.titulo}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-3 w-24 text-center">Código</th>
                        <th className="px-6 py-3">Descripción / Concepto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {anexo.items.map((item, i) => (
                        <tr key={i} className="bg-slate-800 hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-blue-400 font-bold text-center bg-slate-900/20 border-r border-slate-700/50">
                            {item.codigo}
                          </td>
                          <td className="px-6 py-4">{item.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 text-slate-500 bg-slate-800 rounded-xl border border-slate-700">
              <Table className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No hay anexos cargados para este año.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}