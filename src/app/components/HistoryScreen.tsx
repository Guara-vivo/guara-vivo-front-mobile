import { Calendar, MapPin, Users, Eye, Search, Filter } from 'lucide-react';
import { Header } from './Header';
import { FilterDialog, FilterOptions } from './FilterDialog';
import { useState, useRef, useEffect } from 'react';

interface HistoryScreenProps {
  onNavigate: (screen: string, recordId?: number) => void;
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const recordsListRef = useRef<HTMLDivElement>(null);

  // Scroll para o início da lista ao mudar de página
  useEffect(() => {
    if (recordsListRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Resetar para primeira página ao aplicar filtros
    // TODO: Integração com backend - enviar filtros para API e recarregar dados
    console.log('Filtros aplicados:', filters);
  };

  // Mock de todos os registros - em produção virá da API
  const allMockRecords = [
    {
      id: 1,
      date: '2026-05-12',
      time: '15:30',
      quantity: 3,
      location: 'Área A - Setor Norte',
      behaviors: ['Alimentando', 'Voando'],
      distance: 45,
    },
    {
      id: 2,
      date: '2026-05-11',
      time: '08:15',
      quantity: 5,
      location: 'Área B - Lagoa Sul',
      behaviors: ['Ninhando', 'Pousado'],
      distance: 30,
    },
    {
      id: 3,
      date: '2026-05-10',
      time: '17:45',
      quantity: 2,
      location: 'Área C - Mata Oeste',
      behaviors: ['Em cio', 'Voando'],
      distance: 60,
    },
    {
      id: 4,
      date: '2026-05-09',
      time: '06:20',
      quantity: 4,
      location: 'Área A - Setor Norte',
      behaviors: ['Alimentando'],
      distance: 25,
    },
    {
      id: 5,
      date: '2026-05-08',
      time: '14:00',
      quantity: 1,
      location: 'Área D - Cerrado Leste',
      behaviors: ['Pousado'],
      distance: 50,
    },
    {
      id: 6,
      date: '2026-05-07',
      time: '16:30',
      quantity: 2,
      location: 'Área A - Setor Norte',
      behaviors: ['Voando'],
      distance: 35,
    },
    {
      id: 7,
      date: '2026-05-06',
      time: '10:15',
      quantity: 4,
      location: 'Área B - Lagoa Sul',
      behaviors: ['Alimentando', 'Pousado'],
      distance: 40,
    },
    {
      id: 8,
      date: '2026-05-05',
      time: '07:45',
      quantity: 1,
      location: 'Área C - Mata Oeste',
      behaviors: ['Ninhando'],
      distance: 55,
    },
    {
      id: 9,
      date: '2026-05-04',
      time: '13:20',
      quantity: 3,
      location: 'Área D - Cerrado Leste',
      behaviors: ['Voando', 'Alimentando'],
      distance: 48,
    },
    {
      id: 10,
      date: '2026-05-03',
      time: '11:00',
      quantity: 2,
      location: 'Área A - Setor Norte',
      behaviors: ['Pousado'],
      distance: 30,
    },
    {
      id: 11,
      date: '2026-05-02',
      time: '15:50',
      quantity: 5,
      location: 'Área B - Lagoa Sul',
      behaviors: ['Em cio', 'Voando'],
      distance: 42,
    },
    {
      id: 12,
      date: '2026-05-01',
      time: '09:30',
      quantity: 1,
      location: 'Área C - Mata Oeste',
      behaviors: ['Alimentando'],
      distance: 38,
    },
  ];

  // Filtrar registros por busca e filtros ativos
  const filteredRecords = allMockRecords.filter((record) => {
    // Filtro de busca por texto
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        record.location.toLowerCase().includes(searchLower) ||
        record.date.includes(searchTerm) ||
        record.behaviors.some((b) => b.toLowerCase().includes(searchLower)) ||
        record.id.toString().includes(searchTerm)
      );
      if (!matchesSearch) return false;
    }

    // Filtro de data (de)
    if (activeFilters.dateFrom && record.date < activeFilters.dateFrom) {
      return false;
    }

    // Filtro de data (até)
    if (activeFilters.dateTo && record.date > activeFilters.dateTo) {
      return false;
    }

    // Filtro de localização
    if (activeFilters.location && !record.location.toLowerCase().includes(activeFilters.location.toLowerCase())) {
      return false;
    }

    // Filtro de quantidade mínima
    if (activeFilters.minQuantity && record.quantity < activeFilters.minQuantity) {
      return false;
    }

    // Filtro de quantidade máxima
    if (activeFilters.maxQuantity && record.quantity > activeFilters.maxQuantity) {
      return false;
    }

    // Filtro de comportamentos (deve ter pelo menos um dos comportamentos selecionados)
    if (activeFilters.behaviors && activeFilters.behaviors.length > 0) {
      const hasMatchingBehavior = activeFilters.behaviors.some((filterBehavior) =>
        record.behaviors.includes(filterBehavior)
      );
      if (!hasMatchingBehavior) return false;
    }

    return true;
  });

  // Calcular registros para página atual
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Resetar para página 1 quando buscar ou aplicar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  // Funções de navegação
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // TODO: Integração com backend - buscar dados da página específica
    // fetch(`/api/records?page=${pageNumber}&limit=${recordsPerPage}`)
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Gerar números de página para exibir
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-24">
      <Header title="Histórico de Registros" />

      {/* Modal de Filtros */}
      <FilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />

      <div className="pt-24 px-6 max-w-6xl mx-auto">
        {/* Filtros e Busca */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#79A7EB]" />
              <input
                type="text"
                placeholder="Buscar por local, data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1]"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#125ED0] hover:bg-[#0f4da8] text-[#F1F1F1] rounded-lg uppercase text-sm tracking-wide transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filtros
              {Object.values(activeFilters).filter(v => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)).length > 0 && (
                <span className="ml-1 w-5 h-5 bg-[#F2201F] rounded-full flex items-center justify-center text-xs">
                  {Object.values(activeFilters).filter(v => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Lista de Registros */}
        <div ref={recordsListRef} className="space-y-4">
          {currentRecords.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-[#1A1A1A]/60">
                {searchTerm || Object.values(activeFilters).some(v => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true))
                  ? 'Nenhum registro encontrado com os filtros aplicados'
                  : 'Nenhum registro disponível'}
              </p>
            </div>
          ) : (
            currentRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#F2201F] text-[#F1F1F1] px-3 py-1 rounded-lg uppercase text-sm tracking-wide">
                      #{record.id.toString().padStart(3, '0')}
                    </div>
                    <div className="flex items-center gap-2 text-[#1A1A1A]">
                      <Calendar className="w-4 h-4 text-[#79A7EB]" />
                      <span>{new Date(record.date).toLocaleDateString('pt-BR')}</span>
                      <span className="text-[#79A7EB]">•</span>
                      <span>{record.time}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#F2201F]" />
                      <span className="text-[#1A1A1A]">{record.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#F2201F]" />
                      <span className="text-[#1A1A1A]">
                        {record.quantity} {record.quantity === 1 ? 'indivíduo' : 'indivíduos'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#F2201F]" />
                      <span className="text-[#1A1A1A]">Dist: {record.distance}m</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {record.behaviors.map((behavior) => (
                      <span
                        key={behavior}
                        className="px-3 py-1 bg-[#79A7EB]/20 text-[#125ED0] rounded-lg text-xs uppercase tracking-wide"
                      >
                        {behavior}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('record-detail', record.id)}
                  className="px-6 py-3 bg-[#125ED0] hover:bg-[#0f4da8] text-[#F1F1F1] rounded-lg uppercase text-sm tracking-wide transition-colors whitespace-nowrap"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-[#79A7EB] text-[#125ED0] hover:bg-[#F1F1F1]'
              }`}
            >
              Anterior
            </button>

            {getPageNumbers().map((pageNumber, index) => (
              pageNumber === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-[#1A1A1A]/60">
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber as number)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-[#F2201F] text-[#F1F1F1]'
                      : 'bg-white border-2 border-[#79A7EB] text-[#125ED0] hover:bg-[#F1F1F1]'
                  }`}
                >
                  {pageNumber}
                </button>
              )
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-[#79A7EB] text-[#125ED0] hover:bg-[#F1F1F1]'
              }`}
            >
              Próxima
            </button>
          </div>
        )}

        {/* Informação da paginação */}
        {filteredRecords.length > 0 && (
          <div className="mt-4 text-center text-sm text-[#1A1A1A]/60">
            Mostrando {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredRecords.length)} de {filteredRecords.length} registros
            {(searchTerm || Object.values(activeFilters).some(v => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true))) &&
              ` (filtrado de ${allMockRecords.length} total)`}
          </div>
        )}
      </div>
    </div>
  );
}
