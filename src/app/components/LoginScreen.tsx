import { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-[#1A1A1A] mb-12">Acessar conta</h1>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <input
              type="email"
              placeholder="E-mail de acesso"
              className="w-full pb-3 border-b border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:outline-none bg-transparent text-[#1A1A1A] placeholder:text-[#1A1A1A]/40"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha de acesso"
              className="w-full pb-3 border-b border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:outline-none bg-transparent text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('forgot-password');
              }}
              className="text-[#125ED0] hover:underline"
            >
              Recuperar senha
            </a>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-black text-[#F1F1F1] py-4 rounded-xl uppercase tracking-wide transition-colors shadow-lg"
            >
              Acessar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
