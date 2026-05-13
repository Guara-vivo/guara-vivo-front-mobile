import { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';

interface RegisterPasswordScreenProps {
  onNavigate: (screen: string) => void;
}

export function RegisterPasswordScreen({ onNavigate }: RegisterPasswordScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-[#1A1A1A] mb-12">Crie sua senha</h1>

        <form onSubmit={handleContinue} className="space-y-6">
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
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
            <p className="text-xs text-[#1A1A1A]/50 mt-2">Mínimo de 8 caracteres</p>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar senha"
              className="w-full pb-3 border-b border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:outline-none bg-transparent text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-0 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          <div className="pt-80">
            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-black text-[#F1F1F1] py-4 rounded-xl uppercase tracking-wide transition-colors shadow-lg"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
