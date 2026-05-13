import { Camera, MapPin, Calendar, Users, Activity, Loader2, X } from 'lucide-react';
import { Header } from './Header';
import { ConfirmDialog } from './ConfirmDialog';
import { useState, useEffect, useRef } from 'react';

interface RegisterScreenProps {
  onNavigate: (screen: string) => void;
}

export function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [behaviors, setBehaviors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aiResults, setAiResults] = useState<{
    quantity: number | null;
    location: { lat: string; lng: string } | null;
    distance: number | null;
  }>({
    quantity: null,
    location: null,
    distance: null,
  });

  // Data e hora atual como padrão
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  const [dateTime, setDateTime] = useState(getCurrentDateTime());

  // Upload de imagens e análise de IA
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImageFiles([...imageFiles, ...fileArray]);

      // Criar previews
      const newPreviews: string[] = [];
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === fileArray.length) {
            setImages([...images, ...newPreviews]);

            // Simula análise de IA
            if (aiResults.quantity === null) {
              analyzeImages();
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const analyzeImages = () => {
    setIsAnalyzing(true);

    // Simula processamento de IA
    // TODO: Integração com backend - enviar imagens para API de análise
    setTimeout(() => {
      setAiResults({
        quantity: 3,
        location: { lat: '-15.7801', lng: '-47.9292' },
        distance: 45,
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const toggleBehavior = (behavior: string) => {
    if (behaviors.includes(behavior)) {
      setBehaviors(behaviors.filter((b) => b !== behavior));
    } else {
      setBehaviors([...behaviors, behavior]);
    }
  };

  const handleSave = () => {
    // TODO: Integração com backend
    // Enviar dados para API:
    // - imageFiles (arquivos de imagem)
    // - behaviors (array de comportamentos)
    // - dateTime (data e hora)
    // - aiResults (resultados da IA)

    console.log('Dados para enviar ao backend:', {
      images: imageFiles,
      behaviors,
      dateTime,
      aiResults,
    });

    // Após sucesso da API, navegar de volta
    onNavigate('home');
  };

  const handleCancel = () => {
    // Limpar formulário e voltar
    setImages([]);
    setImageFiles([]);
    setAiResults({ quantity: null, location: null, distance: null });
    setBehaviors([]);
    setDateTime(getCurrentDateTime());
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-24">
      <Header title="Novo Registro" />

      {/* Dialogs de Confirmação */}
      <ConfirmDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={handleSave}
        title="Salvar Registro"
        message="Deseja confirmar o registro deste avistamento?"
        confirmText="Salvar"
        cancelText="Revisar"
        type="success"
      />

      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancelar Registro"
        message="Tem certeza que deseja cancelar? Os dados não serão salvos."
        confirmText="Sim, cancelar"
        cancelText="Continuar editando"
        type="warning"
      />

      {/* Dialog de Validação */}

      <ConfirmDialog
        isOpen={showValidationDialog}
        onClose={() => setShowValidationDialog(false)}
        onConfirm={() => setShowValidationDialog(false)}
        title="Dados Incompletos"
        message="Por favor, adicione pelo menos uma imagem do avistamento para continuar."
        confirmText="Entendi"
        type="warning"
      />

      <div className="pt-24 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-[#125ED0] mb-6 uppercase tracking-wide flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Informações do Avistamento
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (images.length === 0 || aiResults.quantity === null) {
                setShowValidationDialog(true);
              } else {
                setShowSaveDialog(true);
              }
            }}
            className="space-y-6"
          >
            {/* Upload de Imagens - PRIMEIRO */}
            <div>
              <label className="block text-[#1A1A1A] mb-2 uppercase text-sm tracking-wide flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#F2201F]" />
                Imagens do Avistamento
              </label>

              {/* Preview das imagens */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#79A7EB]">
                      <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-[#F2201F] hover:bg-[#d11d1c] rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#79A7EB] rounded-lg p-8 text-center hover:border-[#125ED0] transition-colors cursor-pointer bg-white"
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-3 text-[#125ED0] animate-spin" />
                    <p className="text-[#125ED0]">Analisando imagens com IA...</p>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 mx-auto mb-3 text-[#79A7EB]" />
                    <p className="text-[#1A1A1A] mb-1">
                      {images.length > 0 ? 'Clique para adicionar mais fotos' : 'Clique para adicionar fotos'}
                    </p>
                    <p className="text-sm text-[#1A1A1A] opacity-60">ou arraste e solte aqui</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resultados da IA - Somente exibição */}
            {aiResults.quantity !== null && (
              <div className="bg-[#79A7EB]/10 border-2 border-[#79A7EB] rounded-lg p-6">
                <h3 className="text-[#125ED0] mb-4 uppercase text-sm tracking-wide flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Análise Automática (IA)
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#1A1A1A]">
                      <Users className="w-5 h-5 text-[#F2201F]" />
                      <span className="uppercase text-sm tracking-wide">Quantidade de Indivíduos:</span>
                    </div>
                    <span className="text-lg">{aiResults.quantity}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#1A1A1A]">
                      <MapPin className="w-5 h-5 text-[#F2201F]" />
                      <span className="uppercase text-sm tracking-wide">Localização:</span>
                    </div>
                    <span className="text-sm">{aiResults.location?.lat}, {aiResults.location?.lng}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#1A1A1A]">
                      <Activity className="w-5 h-5 text-[#F2201F]" />
                      <span className="uppercase text-sm tracking-wide">Distância Estimada:</span>
                    </div>
                    <span className="text-lg">{aiResults.distance}m</span>
                  </div>
                </div>
              </div>
            )}

            {/* Comportamento */}
            <div>
              <label className="block text-[#1A1A1A] mb-3 uppercase text-sm tracking-wide flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#F2201F]" />
                Comportamento Observado
              </label>
              <div className="space-y-3">
                {['Em cio', 'Ninhando', 'Alimentando', 'Voando', 'Pousado'].map((behavior) => (
                  <label
                    key={behavior}
                    className="flex items-center gap-3 p-3 bg-[#F1F1F1] rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={behaviors.includes(behavior)}
                      onChange={() => toggleBehavior(behavior)}
                      className="w-5 h-5 accent-[#F2201F]"
                    />
                    <span>{behavior}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Data e Hora */}
            <div>
              <label className="block text-[#1A1A1A] mb-2 uppercase text-sm tracking-wide flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#F2201F]" />
                Data e Hora do Avistamento
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={dateTime.date}
                  onChange={(e) => setDateTime({ ...dateTime, date: e.target.value })}
                  className="px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1]"
                />
                <input
                  type="time"
                  value={dateTime.time}
                  onChange={(e) => setDateTime({ ...dateTime, time: e.target.value })}
                  className="px-4 py-3 border-2 border-[#79A7EB] rounded-lg focus:outline-none focus:border-[#125ED0] bg-[#F1F1F1]"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#F2201F] hover:bg-[#d11d1c] text-[#F1F1F1] py-4 rounded-lg uppercase tracking-wide transition-colors shadow-lg"
              >
                Salvar Registro
              </button>
              <button
                type="button"
                onClick={() => setShowCancelDialog(true)}
                className="px-8 bg-[#79A7EB] hover:bg-[#125ED0] text-[#F1F1F1] py-4 rounded-lg uppercase tracking-wide transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
