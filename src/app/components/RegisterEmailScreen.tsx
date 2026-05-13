interface RegisterEmailScreenProps {
  onNavigate: (screen: string) => void;
}

export function RegisterEmailScreen({ onNavigate }: RegisterEmailScreenProps) {
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('register-password');
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-[#1A1A1A] mb-12">Crie sua conta</h1>

        <form onSubmit={handleContinue} className="space-y-8">
          <div>
            <input
              type="email"
              placeholder="Qual seu e-mail?"
              className="w-full pb-3 border-b border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:outline-none bg-transparent text-[#1A1A1A] placeholder:text-[#1A1A1A]/40"
            />
          </div>

          <div className="pt-96">
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
