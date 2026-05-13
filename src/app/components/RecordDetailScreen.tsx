import { ArrowLeft, Calendar, MapPin, Users, Eye, Activity, Camera } from 'lucide-react';

interface RecordDetailScreenProps {
  onNavigate: (screen: string) => void;
  recordId?: number;
}

export function RecordDetailScreen({ onNavigate, recordId = 1 }: RecordDetailScreenProps) {
  // Mock de dados - em produção viria da API
  const record = {
    id: recordId,
    date: '2026-05-12',
    time: '15:30',
    quantity: 3,
    location: { name: 'Área A - Setor Norte', lat: '-15.7801', lng: '-47.9292' },
    behaviors: ['Alimentando', 'Voando'],
    distance: 45,
    observations: 'Grupo de três indivíduos avistados próximo à área de vegetação densa.',
    images: 2,
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-24">
      <div className="fixed top-0 left-0 right-0 bg-[#125ED0] shadow-lg z-10">
        <div className="flex items-center gap-4 px-6 py-4 max-w-screen-lg mx-auto">
          <button
            onClick={() => onNavigate('history')}
            className="text-[#F1F1F1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[#F1F1F1] uppercase tracking-wide">Detalhes do Registro</h1>
        </div>
      </div>

      <div className="pt-20 px-6 max-w-3xl mx-auto">
        {/* ID do Registro */}
        <div className="bg-[#F2201F] text-[#F1F1F1] px-4 py-2 rounded-xl inline-block mb-6">
          <span className="uppercase text-sm tracking-wide">#{record.id.toString().padStart(3, '0')}</span>
        </div>

        {/* Informações Principais */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-[#125ED0] mb-6 uppercase tracking-wide text-sm">Informações Gerais</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#F2201F] flex-shrink-0 mt-1" />
              <div>
                <div className="text-xs text-[#1A1A1A]/60 uppercase tracking-wide mb-1">Data e Hora</div>
                <div className="text-[#1A1A1A]">
                  {new Date(record.date).toLocaleDateString('pt-BR')} às {record.time}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#F2201F] flex-shrink-0 mt-1" />
              <div>
                <div className="text-xs text-[#1A1A1A]/60 uppercase tracking-wide mb-1">Localização</div>
                <div className="text-[#1A1A1A] mb-1">{record.location.name}</div>
                <div className="text-sm text-[#1A1A1A]/60">
                  Lat: {record.location.lat} / Lng: {record.location.lng}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#F2201F] flex-shrink-0 mt-1" />
              <div>
                <div className="text-xs text-[#1A1A1A]/60 uppercase tracking-wide mb-1">Quantidade</div>
                <div className="text-[#1A1A1A]">
                  {record.quantity} {record.quantity === 1 ? 'indivíduo' : 'indivíduos'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-[#F2201F] flex-shrink-0 mt-1" />
              <div>
                <div className="text-xs text-[#1A1A1A]/60 uppercase tracking-wide mb-1">Distância Estimada</div>
                <div className="text-[#1A1A1A]">{record.distance} metros</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comportamentos */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-[#125ED0] mb-4 uppercase tracking-wide text-sm flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Comportamentos Observados
          </h2>
          <div className="flex flex-wrap gap-2">
            {record.behaviors.map((behavior) => (
              <span
                key={behavior}
                className="px-4 py-2 bg-[#79A7EB]/20 text-[#125ED0] rounded-lg text-sm uppercase tracking-wide"
              >
                {behavior}
              </span>
            ))}
          </div>
        </div>

        {/* Imagens */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-[#125ED0] mb-4 uppercase tracking-wide text-sm flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Imagens ({record.images})
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-video bg-[#79A7EB]/20 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#125ED0]/40" />
            </div>
            <div className="aspect-video bg-[#79A7EB]/20 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#125ED0]/40" />
            </div>
          </div>
        </div>

        {/* Observações */}
        {record.observations && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-[#125ED0] mb-4 uppercase tracking-wide text-sm">Observações</h2>
            <p className="text-[#1A1A1A] leading-relaxed">{record.observations}</p>
          </div>
        )}
      </div>
    </div>
  );
}
