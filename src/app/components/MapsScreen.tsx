import {
	Map,
	MapPin,
	Home as HomeIcon,
	Utensils,
	Circle,
	Layers,
} from 'lucide-react'
import { Header } from './Header'
import { useState } from 'react'
import { Button } from './ui/button'

// TODO: Quando integrar MapLibre, descomentar os imports abaixo:
// import { useEffect, useRef } from 'react';
// import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import { MAP_CONFIG } from '../../config/map';

export function MapsScreen() {
	const [selectedLayer, setSelectedLayer] = useState<
		'all' | 'feeding' | 'nests'
	>('all')
	const [zoom, setZoom] = useState(13)

	// TODO: Quando integrar MapLibre, descomentar as refs abaixo:
	// const mapContainer = useRef<HTMLDivElement>(null);
	// const map = useRef<maplibregl.Map | null>(null);
	// const markersRef = useRef<maplibregl.Marker[]>([]);

	// TODO: Quando integrar com backend, descomentar:
	// const [points, setPoints] = useState([]);

	// Controles de zoom
	const handleZoomIn = () => {
		setZoom(Math.min(zoom + 1, 20))
		// TODO: Quando integrar MapLibre, adicionar:
		// if (map.current) map.current.zoomTo(Math.min(zoom + 1, 20));
	}

	const handleZoomOut = () => {
		setZoom(Math.max(zoom - 1, 1))
		// TODO: Quando integrar MapLibre, adicionar:
		// if (map.current) map.current.zoomTo(Math.max(zoom - 1, 1));
	}

	// TODO: Quando integrar MapLibre, adicionar useEffect para inicializar mapa:
	/*
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_CONFIG.style,
      center: [MAP_CONFIG.center.lng, MAP_CONFIG.center.lat],
      zoom: zoom
    });

    map.current.on('zoom', () => {
      if (map.current) setZoom(Math.round(map.current.getZoom()));
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  */

	// TODO: Quando integrar MapLibre, adicionar useEffect para atualizar marcadores:
	/*
  useEffect(() => {
    if (!map.current) return;

    // Remover marcadores existentes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filtrar pontos baseado na camada selecionada
    const filteredPoints = points.filter(point => {
      if (selectedLayer === 'all') return true;
      if (selectedLayer === 'feeding') return point.type === 'feeding';
      if (selectedLayer === 'nests') return point.type === 'nest';
      return false;
    });

    // Adicionar novos marcadores
    filteredPoints.forEach(point => {
      const el = document.createElement('div');
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getMarkerColor(point.type);
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(createPopupHTML(point));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [selectedLayer, points]);
  */

	return (
		<div className="min-h-screen bg-[var(--color-muted)] pb-24">
			<Header title="Mapas" />

			<div className="mx-auto max-w-6xl px-4 pt-24 md:px-6">
				{/* Seletor de Camadas - Compacto Mobile First */}
				<div className="bg-[var(--color-card)] rounded-xl shadow-lg p-3 mb-3">
					<div className="flex items-center gap-2 mb-2">
						<Layers className="w-4 h-4 text-[var(--color-secondary)]" />
						<span className="text-[var(--color-secondary)] uppercase text-xs tracking-wide">
							Camada
						</span>
					</div>

					<div className="flex gap-2 overflow-x-auto">
						<button
							onClick={() => setSelectedLayer('all')}
							className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
								selectedLayer === 'all'
									? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-primary-foreground)]'
									: 'bg-[var(--color-card)] border-[var(--color-secondary-light)] text-[var(--color-foreground)]'
							}`}
						>
							<MapPin className="w-4 h-4" />
							<span className="text-xs uppercase tracking-wide">Todos</span>
						</button>

						<button
							onClick={() => setSelectedLayer('feeding')}
							className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
								selectedLayer === 'feeding'
									? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-primary-foreground)]'
									: 'bg-[var(--color-card)] border-[var(--color-secondary-light)] text-[var(--color-foreground)]'
							}`}
						>
							<Utensils className="w-4 h-4" />
							<span className="text-xs uppercase tracking-wide">
								Alimentação
							</span>
						</button>

						<button
							onClick={() => setSelectedLayer('nests')}
							className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
								selectedLayer === 'nests'
									? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-primary-foreground)]'
									: 'bg-[var(--color-card)] border-[var(--color-secondary-light)] text-[var(--color-foreground)]'
							}`}
						>
							<HomeIcon className="w-4 h-4" />
							<span className="text-xs uppercase tracking-wide">Ninhos</span>
						</button>
					</div>
				</div>

				{/* Container do Mapa */}
				<div className="bg-[var(--color-card)] rounded-xl shadow-lg overflow-hidden mb-3">
					<div className="relative w-full h-[calc(100vh-280px)] min-h-[400px] bg-gradient-to-br from-[var(--color-secondary-light)]/20 to-[var(--color-secondary)]/20">
						{/*
              TODO: Quando integrar MapLibre, substituir este div por:
              <div ref={mapContainer} className="w-full h-full" />

              E remover toda a visualização simulada abaixo (ícone, marcadores simulados, etc.)
            */}

						{/* Visualização simulando mapa */}
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<div className="text-[var(--color-secondary)] opacity-20">
								<Map className="w-16 h-16" />
							</div>
						</div>

						{/* Pontos de concentração simulados */}
						{selectedLayer !== 'nests' && (
							<>
								<div className="absolute top-1/4 left-1/3 w-32 h-32 bg-[var(--color-primary)] opacity-20 rounded-full blur-xl animate-pulse" />
								<div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[var(--color-primary)] opacity-30 rounded-full blur-xl animate-pulse" />
								<div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-[var(--color-primary)] opacity-25 rounded-full blur-xl animate-pulse" />
							</>
						)}

						{/* Marcadores simulados */}
						<MapPin className="absolute top-1/4 left-1/3 w-6 h-6 text-[var(--color-primary)] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
						<MapPin className="absolute top-1/2 right-1/4 w-6 h-6 text-[var(--color-primary)] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
						<MapPin className="absolute bottom-1/4 left-1/2 w-6 h-6 text-[var(--color-primary)] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />

						{selectedLayer === 'nests' && (
							<>
								<HomeIcon className="absolute top-1/3 left-1/4 w-6 h-6 text-[var(--color-secondary)] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
								<HomeIcon className="absolute bottom-1/3 right-1/3 w-6 h-6 text-[var(--color-secondary)] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
								{/* Rota de voo */}
								<svg className="absolute inset-0 w-full h-full pointer-events-none">
									<path
										d="M 25% 33% Q 50% 10%, 67% 67%"
										stroke="var(--color-secondary)"
										strokeWidth="2"
										fill="none"
										strokeDasharray="8,4"
										opacity="0.7"
									/>
								</svg>
							</>
						)}

						{/* Controles de Zoom */}
						<div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
							<button
								onClick={handleZoomIn}
								disabled={zoom >= 20}
								className={`p-2 rounded-lg shadow-lg transition-colors border border-[var(--color-secondary-light)] ${
									zoom >= 20
										? 'bg-gray-100 cursor-not-allowed opacity-50'
										: 'bg-[var(--color-card)] hover:bg-[var(--color-muted)]'
								}`}
								title="Aumentar zoom"
							>
								<span className="text-[var(--color-secondary)] text-lg leading-none font-bold">
									+
								</span>
							</button>
							<button
								onClick={handleZoomOut}
								disabled={zoom <= 1}
								className={`p-2 rounded-lg shadow-lg transition-colors border border-[var(--color-secondary-light)] ${
									zoom <= 1
										? 'bg-gray-100 cursor-not-allowed opacity-50'
										: 'bg-[var(--color-card)] hover:bg-[var(--color-muted)]'
								}`}
								title="Diminuir zoom"
							>
								<span className="text-[var(--color-secondary)] text-lg leading-none font-bold">
									−
								</span>
							</button>
						</div>

						{/* Indicador de Zoom */}
						<div className="absolute top-3 left-3 bg-[var(--color-card)]/95 backdrop-blur px-3 py-1 rounded-lg shadow-lg z-10">
							<p className="text-xs text-[var(--color-foreground)]">
								Zoom:{' '}
								<strong className="text-[var(--color-secondary)]">
									{zoom}
								</strong>
							</p>
						</div>

						{/* Badge de contagem de pontos no mapa */}
						<div className="absolute bottom-3 right-3 bg-[var(--color-card)]/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg z-10">
							<p className="text-xs text-[var(--color-foreground)]">
								<strong className="text-[var(--color-primary)]">
									{selectedLayer === 'all'
										? '247'
										: selectedLayer === 'feeding'
											? '89'
											: '12'}
								</strong>{' '}
								{selectedLayer === 'all'
									? 'registros'
									: selectedLayer === 'feeding'
										? 'áreas'
										: 'ninhos'}
							</p>
						</div>
					</div>
				</div>

				{/* Legenda - Compacta */}
				<div className="bg-white rounded-xl shadow-lg p-4">
					<h3 className="mb-3 text-xs uppercase tracking-wide text-[var(--color-secondary)]">
						Legenda
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
						<div className="flex items-center gap-2">
							<Circle className="w-3 h-3 flex-shrink-0 fill-[var(--color-primary)] text-[var(--color-primary)]" />
							<span className="text-xs">Alta Concentração</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin className="w-3 h-3 flex-shrink-0 text-[var(--color-primary)]" />
							<span className="text-xs">Avistamento</span>
						</div>
						<div className="flex items-center gap-2">
							<HomeIcon className="w-3 h-3 flex-shrink-0 text-[var(--color-secondary)]" />
							<span className="text-xs">Ninho</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
