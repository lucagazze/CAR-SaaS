import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useViewAs } from '../../contexts/ViewAsContext';
import { ChevronDown, Search, X, Building2, RotateCcw, Check } from 'lucide-react';

export const AdminClientSelector: React.FC = () => {
  const { profile: authProfile } = useAuth();
  const { viewAsProfile, setViewAsProfile, isViewingAs, allClients } = useViewAs();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!authProfile?.is_admin) return null;

  const filteredClients = allClients.filter(c =>
    (c.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    ((c as any).email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Subtle trigger button in top navigation bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 px-2.5 sm:px-3 rounded-xl text-[12px] font-medium transition-all flex items-center gap-2 border shadow-2xs select-none ${
          isViewingAs
            ? 'bg-violet-500/10 hover:bg-violet-500/15 border-violet-500/30 text-violet-700 dark:text-violet-300 font-bold'
            : 'bg-zinc-100/90 dark:bg-zinc-800/60 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/60 border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300'
        }`}
        title="Seleccionar cliente (Vista Admin)"
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isViewingAs ? 'bg-violet-500 animate-pulse' : 'bg-violet-500'}`} />
        
        <span className="truncate max-w-[110px] sm:max-w-[170px] text-left">
          {isViewingAs ? viewAsProfile?.business_name : 'Mi Vista'}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-64 sm:w-72 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[250] overflow-hidden p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          
          {/* Header info */}
          <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Seleccionar cliente
            </span>
            {isViewingAs && (
              <button
                onClick={() => {
                  setViewAsProfile(null);
                  setIsOpen(false);
                }}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Volver a mi vista
              </button>
            )}
          </div>

          {/* Search box if > 3 clients */}
          {allClients.length > 3 && (
            <div className="relative mb-1 px-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-7 pl-7 pr-6 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 text-[11px] text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Client List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar">
            {/* Mi Vista Option */}
            <button
              onClick={() => {
                setViewAsProfile(null);
                setIsOpen(false);
              }}
              className={`w-full px-2.5 py-1.5 rounded-xl text-left text-[12px] flex items-center justify-between transition-colors ${
                !isViewingAs
                  ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 font-bold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">Mi Vista (Admin)</span>
              </div>
              {!isViewingAs && <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />}
            </button>

            <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-1" />

            {filteredClients.length === 0 ? (
              <p className="text-[11px] text-zinc-400 text-center py-3">No hay clientes disponibles</p>
            ) : (
              filteredClients.map((c) => {
                const isSelected = viewAsProfile?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setViewAsProfile({
                        ...c,
                        is_admin: false,
                      } as any);
                      setIsOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left text-[12px] flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 font-bold'
                        : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-medium'
                    }`}
                  >
                    <span className="truncate">{c.business_name || (c as any).email || 'Cliente sin nombre'}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
