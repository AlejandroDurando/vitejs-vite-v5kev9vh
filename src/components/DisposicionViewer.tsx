import { useState } from 'react';
import { FileText, Search, Users, CreditCard, ChevronDown, ChevronRight } from 'lucide-react';
import { DISPOSICIONES } from '../data/disposicionData';

// Componente pequeño para el Acordeón de cada Artículo
const ArticleAccordion = ({ articulo }: { articulo: { numero: number, titulo: string, contenido: string[] } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800 transition-all hover:border-slate-600">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
      >
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
                {parrafo}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export function DisposicionViewer({ year }: { year: number }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'NORMATIVA' | 'FONDOS'>('FONDOS');
  
  const data = DISPOSICIONES[year as keyof typeof DISPOSICIONES];

  if (!data) return <div className="text-center p-10 text-slate-400">No hay disposición cargada para el año {year}</div>;

  const filteredFondos = data.fondos.filter(f => 
    f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.responsables.some(r => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in pb-10">
      {/* Encabezado */}
      <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-500/20">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{data.titulo}</h2>
            <p className="text-blue-400 font-medium text-sm">{data.subtitulo}</p>
            <p className="text-slate-500 text-xs mt-1">{data.fecha}</p>
          </div>
        </div>
      </div>

      {/* Navegación Interna */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-2 z-10 bg-[#0f1623]/95 p-2 rounded-xl backdrop-blur">
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('FONDOS')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'FONDOS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            Fondos Asignados
          </button>
          <button
            onClick={() => setActiveTab('NORMATIVA')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'NORMATIVA' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            Normativa Legal
          </button>
        </div>

        {activeTab === 'FONDOS' && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar responsable o fondo..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-blue-400 focus:outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* VISTA: FONDOS */}
      {activeTab === 'FONDOS' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {filteredFondos.map((fondo, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all shadow-lg group">
              
              <div className="p-4 border-b border-slate-700 bg-slate-900/30 group-hover:bg-slate-900/50 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  
                  {/* --- CAMBIO: FONDO # CON ESTILO "BADGE" --- */}
                  <span className="text-xs font-extrabold text-white bg-blue-600 border border-blue-400 px-3 py-1.5 rounded shadow-[0_0_10px_rgba(59,130,246,0.5)] tracking-wider">
                    FONDO #{fondo.numero}
                  </span>

                  {/* Tarjeta de Dinero */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                    <span className="text-[10px] text-blue-400/60 uppercase font-semibold tracking-wider mr-1">
                      Monto
                    </span>
                    <span className="text-blue-400 font-bold font-mono text-lg tracking-tight">
                      {fondo.monto}
                    </span>
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg leading-tight mt-1">{fondo.nombre}</h3>
                
                <div className="flex items-center gap-2 mt-3 text-slate-400 text-xs">
                  <CreditCard className="w-3 h-3 text-blue-400" />
                  <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-500">
                    {fondo.cuenta}
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/50">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users className="w-3 h-3" /> Responsables Habilitados
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {fondo.responsables.map((resp, rIdx) => (
                    <div key={rIdx} className="flex justify-between items-center text-sm p-2 rounded bg-slate-900/40 border border-slate-700/50 hover:bg-slate-900/80 transition-colors">
                      <div>
                        <div className="text-slate-200 font-medium">{resp.nombre}</div>
                        <div className="text-[10px] text-slate-500">DNI: {resp.dni}</div>
                      </div>
                      <div className="text-right">
                        
                        {/* --- CAMBIO: LEGAJO EN BLANCO --- */}
                        <div className="text-xs font-mono text-white bg-white/10 px-2 py-1 rounded border border-white/10 shadow-sm">
                          L: {resp.legajo}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filteredFondos.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-500">
              No se encontraron fondos que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      )}

      {/* VISTA: NORMATIVA */}
      {activeTab === 'NORMATIVA' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Introducción fija */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              VISTO Y CONSIDERANDO
            </h3>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed text-justify border-l-2 border-slate-700 pl-4">
              {data.visto}
            </p>
            <ul className="space-y-3">
              {data.considerando.map((cons, i) => (
                <li key={i} className="text-slate-400 text-sm flex gap-3">
                  <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" />
                  {cons}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="h-px bg-slate-800 my-6" />

          {/* Lista de Artículos Colapsables */}
          <div className="space-y-3">
            {data.articulos.map((art, i) => (
              <ArticleAccordion key={i} articulo={art} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}