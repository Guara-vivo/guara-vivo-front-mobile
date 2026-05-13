import { Home, MapPin, Map, List, User } from 'lucide-react';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'register', icon: MapPin, label: 'Registrar' },
    { id: 'maps', icon: Map, label: 'Mapas' },
    { id: 'history', icon: List, label: 'Histórico' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#1A1A1A]/10 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around items-center h-20 max-w-screen-lg mx-auto px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
              currentScreen === item.id
                ? 'text-[#F2201F] bg-[#F2201F]/10'
                : 'text-[#1A1A1A]/60 hover:text-[#125ED0] hover:bg-[#125ED0]/5'
            }`}
          >
            <item.icon className="w-6 h-6" strokeWidth={currentScreen === item.id ? 2.5 : 2} />
            <span className="text-xs uppercase tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
