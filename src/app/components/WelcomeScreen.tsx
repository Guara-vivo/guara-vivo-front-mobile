import logoFonteClara from "../../imports/Logo_Fonte_Clara.png";

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#E8F1FC] px-6 py-12">
      <div className="flex-1 flex items-center justify-center">
        <img
          src={logoFonteClara}
          alt="GuaráVivo Logo"
          className="h-48 drop-shadow-lg"
        />
      </div>

      <div className="w-full max-w-md space-y-4 pb-8">
        <button
          onClick={() => onNavigate('login')}
          className="w-full bg-[#1A1A1A] hover:bg-black text-[#F1F1F1] py-4 rounded-xl uppercase tracking-wide transition-colors shadow-lg"
        >
          Acessar minha conta
        </button>

        <button
          onClick={() => onNavigate('register-email')}
          className="w-full text-[#1A1A1A] py-4 uppercase tracking-wide transition-colors"
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}
