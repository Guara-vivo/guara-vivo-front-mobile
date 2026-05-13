import logoFonteClara from "../../imports/Logo_Fonte_Clara.png";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  // Auto-avança após 2 segundos
  setTimeout(() => {
    onFinish();
  }, 2000);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8F1FC]">
      <img
        src={logoFonteClara}
        alt="GuaráVivo Logo"
        className="h-40 animate-pulse"
      />
    </div>
  );
}
