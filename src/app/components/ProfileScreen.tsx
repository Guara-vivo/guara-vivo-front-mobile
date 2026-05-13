import { User, Lock, Bell, Info, LogOut } from 'lucide-react';
import { Header } from './Header';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-24">
      <Header title="Meu Perfil" />

      <div className="pt-20 px-6 max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-[#125ED0] flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-[#125ED0]" strokeWidth={2} />
              </div>
            </div>

            {/* Nome e Email */}
            <div className="text-center mb-6">
              <h3 className="text-[#1A1A1A] mb-2">João da Silva Goulard</h3>
              <p className="text-[#1A1A1A]/60 text-sm">joaosgoulard@email.com</p>
            </div>

            {/* Botão Editar */}
            <button
              onClick={() => onNavigate('edit-profile')}
              className="bg-[#125ED0] hover:bg-[#0f4da8] text-[#F1F1F1] px-12 py-3 rounded-lg uppercase text-sm tracking-wide transition-colors"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Configurações */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="text-[#125ED0] mb-4 uppercase text-sm tracking-wide">Configurações</h4>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('change-password')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F1F1F1] rounded-lg transition-colors text-[#1A1A1A]"
              >
                <Lock className="w-5 h-5 text-[#125ED0]" />
                <span>Alterar senha</span>
              </button>
              <button
                onClick={() => onNavigate('notifications')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F1F1F1] rounded-lg transition-colors text-[#1A1A1A]"
              >
                <Bell className="w-5 h-5 text-[#125ED0]" />
                <span>Notificações</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F1F1F1] rounded-lg transition-colors text-[#1A1A1A]"
              >
                <Info className="w-5 h-5 text-[#125ED0]" />
                <span>Sobre o app</span>
              </button>
              <button
                onClick={() => onNavigate('logout')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F1F1F1] rounded-lg transition-colors text-[#F2201F]"
              >
                <LogOut className="w-5 h-5 text-[#F2201F]" />
                <span>Sair da conta</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
