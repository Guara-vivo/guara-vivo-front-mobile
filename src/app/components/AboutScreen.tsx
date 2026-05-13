import { ArrowLeft, Info } from 'lucide-react';
import logoFonteEscura from "../../imports/Logo_Fonte_Escura.png";

interface AboutScreenProps {
  onNavigate: (screen: string) => void;
}

export function AboutScreen({ onNavigate }: AboutScreenProps) {
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
          <h1 className="text-[#F1F1F1] uppercase tracking-wide">Sobre o App</h1>
        </div>
      </div>

      <div className="pt-20 px-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <img
            src={logoFonteEscura}
            alt="GuaráVivo Logo"
            className="h-32 mx-auto mb-6"
          />

          <h2 className="text-[#125ED0] text-xl mb-2 uppercase tracking-wide">GuaráVivo</h2>
          <p className="text-[#1A1A1A]/60 mb-8">Versão 1.0.0</p>

          <div className="text-left space-y-6">
            <div>
              <h3 className="text-[#125ED0] mb-2 uppercase text-sm tracking-wide flex items-center gap-2">
                <Info className="w-4 h-4" />
                Sobre o Projeto
              </h3>
              <p className="text-[#1A1A1A] leading-relaxed text-sm">
                Sistema de auxílio ao monitoramento e proteção do Guará na ARIE.
                O aplicativo facilita o registro de avistamentos, análise de comportamentos
                e geração de mapas de concentração para apoiar a equipe de gestão no
                desenvolvimento de planos de manejo eficientes.
              </p>
            </div>

            <div>
              <h3 className="text-[#125ED0] mb-2 uppercase text-sm tracking-wide">Funcionalidades</h3>
              <ul className="text-[#1A1A1A] text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F2201F]">•</span>
                  <span>Registro de avistamentos com análise IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F2201F]">•</span>
                  <span>Mapeamento de áreas de alimentação e ninhos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F2201F]">•</span>
                  <span>Histórico completo de registros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F2201F]">•</span>
                  <span>Visualização de rotas de voo</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#125ED0] mb-2 uppercase text-sm tracking-wide">Desenvolvedores</h3>
              <p className="text-[#1A1A1A] text-sm">
                Desenvolvido para a ARIE - Área de Relevante Interesse Ecológico
              </p>
            </div>

            <div className="pt-4 border-t border-[#1A1A1A]/10">
              <p className="text-[#1A1A1A]/60 text-xs text-center">
                © 2026 GuaráVivo. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
