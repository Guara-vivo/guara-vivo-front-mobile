import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface ChangePasswordScreenProps {
  onNavigate: (screen: string) => void;
}

export function ChangePasswordScreen({ onNavigate }: ChangePasswordScreenProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Validar senhas antes de abrir diálogo
    // - Verificar se senha atual está correta
    // - Verificar se nova senha tem no mínimo 8 caracteres
    // - Verificar se nova senha e confirmação são iguais
    setShowConfirmDialog(true);
  };

  const handleConfirmChange = () => {
    // TODO: Integração com backend - enviar nova senha para API
    console.log('Senha alterada com sucesso');
    onNavigate('profile');
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-24">
      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmChange}
        title="Confirmar Alteração"
        message="Tem certeza que deseja alterar sua senha? Você precisará fazer login novamente após a alteração."
        confirmText="Sim, alterar"
        cancelText="Cancelar"
        type="success"
      />

      <div className="fixed top-0 left-0 right-0 bg-[#125ED0] shadow-lg z-10">
        <div className="flex items-center gap-4 px-6 py-4 max-w-screen-lg mx-auto">
          <button
            onClick={() => onNavigate('profile')}
            className="text-[#F1F1F1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[#F1F1F1] uppercase tracking-wide">Alterar Senha</h1>
        </div>
      </div>

      <div className="pt-20 px-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Senha Atual */}
            <div>
              <label className="block text-[#1A1A1A] mb-2 uppercase text-sm tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#F2201F]" />
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
                >
                  {showCurrentPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div>
              <label className="block text-[#1A1A1A] mb-2 uppercase text-sm tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#F2201F]" />
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
                >
                  {showNewPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-[#1A1A1A]/60 mt-2">Mínimo de 8 caracteres</p>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="block text-[#1A1A1A] mb-2 uppercase text-sm tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#F2201F]" />
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
                >
                  {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#F2201F] hover:bg-[#d11d1c] text-[#F1F1F1] py-4 rounded-lg uppercase tracking-wide transition-colors shadow-lg"
              >
                Alterar Senha
              </button>
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="px-8 bg-[#79A7EB] hover:bg-[#125ED0] text-[#F1F1F1] py-4 rounded-lg uppercase tracking-wide transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
