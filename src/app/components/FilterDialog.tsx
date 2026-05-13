import { X, Calendar, MapPin, Users } from 'lucide-react';
import { useState } from 'react';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  minQuantity?: number;
  maxQuantity?: number;
  behaviors?: string[];
}

export function FilterDialog({ isOpen, onClose, onApply }: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleBehavior = (behavior: string) => {
    const newBehaviors = selectedBehaviors.includes(behavior)
      ? selectedBehaviors.filter((b) => b !== behavior)
      : [...selectedBehaviors, behavior];
    setSelectedBehaviors(newBehaviors);
    setFilters({ ...filters, behaviors: newBehaviors });
  };

  const handleApply = () => {
    // TODO: Integração com backend - enviar filtros para API
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    setSelectedBehaviors([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 md:animate-in md:fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#1A1A1A]/10 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[#125ED0] uppercase tracking-wide">Filtros</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F1F1F1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Período */}
          <div>
            <label className="block text-[#1A1A1A] mb-3 uppercase text-sm tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F2201F]" />
              Período
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#1A1A1A]/60 mb-2">De</label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#1A1A1A]/60 mb-2">Até</label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1]"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="block text-[#1A1A1A] mb-2 uppercase text-sm tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F2201F]" />
              Localização
            </label>
            <input
              type="text"
              placeholder="Ex: Área A - Setor Norte"
              value={filters.location || ''}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1]"
            />
          </div>

          {/* Quantidade de Indivíduos */}
          <div>
            <label className="block text-[#1A1A1A] mb-3 uppercase text-sm tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F2201F]" />
              Quantidade de Indivíduos
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#1A1A1A]/60 mb-2">Mínimo</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Min"
                  value={filters.minQuantity || ''}
                  onChange={(e) => setFilters({ ...filters, minQuantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#1A1A1A]/60 mb-2">Máximo</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Max"
                  value={filters.maxQuantity || ''}
                  onChange={(e) => setFilters({ ...filters, maxQuantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1]"
                />
              </div>
            </div>
          </div>

          {/* Comportamentos */}
          <div>
            <label className="block text-[#1A1A1A] mb-3 uppercase text-sm tracking-wide">
              Comportamentos
            </label>
            <div className="space-y-2">
              {['Em cio', 'Ninhando', 'Alimentando', 'Voando', 'Pousado'].map((behavior) => (
                <label
                  key={behavior}
                  className="flex items-center gap-3 p-3 bg-[#F1F1F1] rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBehaviors.includes(behavior)}
                    onChange={() => toggleBehavior(behavior)}
                    className="w-5 h-5 accent-[#F2201F]"
                  />
                  <span className="text-sm">{behavior}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#1A1A1A]/10 px-6 py-4 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-3 bg-[#F1F1F1] hover:bg-[#e5e5e5] text-[#1A1A1A] rounded-lg uppercase text-sm tracking-wide transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-[#125ED0] hover:bg-[#0f4da8] text-[#F1F1F1] rounded-lg uppercase text-sm tracking-wide transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
