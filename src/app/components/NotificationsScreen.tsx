import { ArrowLeft, Bell } from 'lucide-react';
import { useState } from 'react';

interface NotificationsScreenProps {
  onNavigate: (screen: string) => void;
}

export function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState({
    newRecords: true,
    mapUpdates: false,
    monthlyReport: true,
    systemAlerts: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-24">
      <div className="fixed top-0 left-0 right-0 bg-[#125ED0] shadow-lg z-10">
        <div className="flex items-center gap-4 px-6 py-4 max-w-screen-lg mx-auto">
          <button
            onClick={() => onNavigate('profile')}
            className="text-[#F1F1F1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[#F1F1F1] uppercase tracking-wide">Notificações</h1>
        </div>
      </div>

      <div className="pt-20 px-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-[#125ED0] mb-6 uppercase tracking-wide text-sm flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Preferências de Notificação
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-lg">
              <div>
                <div className="text-[#1A1A1A] mb-1">Novos Registros</div>
                <div className="text-xs text-[#1A1A1A]/60">
                  Receba notificações sobre novos avistamentos
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={notifications.newRecords}
                  onChange={() => handleToggle('newRecords')}
                  className="opacity-0 w-0 h-0 peer"
                />
                <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-all peer-checked:bg-[#125ED0] before:absolute before:content-[''] before:h-5 before:w-5 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-6"></span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-lg">
              <div>
                <div className="text-[#1A1A1A] mb-1">Atualizações de Mapas</div>
                <div className="text-xs text-[#1A1A1A]/60">
                  Notifique quando houver mudanças nos mapas de calor
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={notifications.mapUpdates}
                  onChange={() => handleToggle('mapUpdates')}
                  className="opacity-0 w-0 h-0 peer"
                />
                <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-all peer-checked:bg-[#125ED0] before:absolute before:content-[''] before:h-5 before:w-5 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-6"></span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-lg">
              <div>
                <div className="text-[#1A1A1A] mb-1">Relatório Mensal</div>
                <div className="text-xs text-[#1A1A1A]/60">
                  Resumo mensal de atividades e estatísticas
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={notifications.monthlyReport}
                  onChange={() => handleToggle('monthlyReport')}
                  className="opacity-0 w-0 h-0 peer"
                />
                <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-all peer-checked:bg-[#125ED0] before:absolute before:content-[''] before:h-5 before:w-5 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-6"></span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-lg">
              <div>
                <div className="text-[#1A1A1A] mb-1">Alertas do Sistema</div>
                <div className="text-xs text-[#1A1A1A]/60">
                  Avisos importantes e atualizações do aplicativo
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={notifications.systemAlerts}
                  onChange={() => handleToggle('systemAlerts')}
                  className="opacity-0 w-0 h-0 peer"
                />
                <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-all peer-checked:bg-[#125ED0] before:absolute before:content-[''] before:h-5 before:w-5 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-6"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
