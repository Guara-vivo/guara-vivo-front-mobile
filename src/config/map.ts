/**
 * Configuração do MapLibre GL JS
 *
 * Este arquivo centraliza todas as configurações do mapa,
 * facilitando a manutenção e customização.
 */

export const MAP_CONFIG = {
  // Centro do mapa (ARIE - Brasília)
  center: {
    lng: -47.9292,
    lat: -15.7801
  },

  // Configurações de zoom
  defaultZoom: 13,
  minZoom: 1,
  maxZoom: 20,

  // Bounds (limites) da área de interesse (ARIE)
  // Isso impede que o usuário navegue muito longe da área relevante
  bounds: {
    sw: { lng: -48.0000, lat: -15.8500 }, // Sudoeste
    ne: { lng: -47.8500, lat: -15.7000 }  // Nordeste
  },

  // Estilo do mapa
  // Opção 1: OpenStreetMap (gratuito, sem API key)
  style: {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [{
      id: 'osm-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }]
  },

  // Opção 2: Maptiler (descomente e adicione sua API key)
  // style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=SUA_API_KEY',

  // Cores dos marcadores
  colors: {
    sighting: '#F2201F',    // Vermelho (avistamentos)
    feeding: '#F2201F',     // Vermelho (áreas de alimentação)
    nest: '#125ED0',        // Azul (ninhos)
    route: '#125ED0',       // Azul (rotas de voo)
    heatmap: [              // Gradiente do heat map
      'rgba(33,102,172,0)',   // Transparente
      'rgb(103,169,207)',     // Azul claro
      'rgb(209,229,240)',     // Azul muito claro
      'rgb(253,219,199)',     // Laranja claro
      'rgb(239,138,98)',      // Laranja
      'rgb(178,24,43)'        // Vermelho
    ]
  },

  // Configurações de marcadores
  markers: {
    size: {
      small: 20,
      medium: 30,
      large: 40
    },
    border: {
      width: 3,
      color: '#ffffff'
    },
    shadow: '0 2px 4px rgba(0,0,0,0.3)'
  },

  // Configurações de heat map
  heatmap: {
    radius: {
      min: 2,
      max: 50
    },
    intensity: {
      min: 1,
      max: 3
    },
    opacity: 0.7
  },

  // Configurações de clustering
  clustering: {
    enabled: true,
    maxZoom: 14,      // Zoom máximo onde clusters aparecem
    radius: 50,       // Raio em pixels para agrupar pontos
    colors: {
      small: '#79A7EB',   // < 10 pontos
      medium: '#125ED0',  // 10-30 pontos
      large: '#F2201F'    // > 30 pontos
    },
    sizes: {
      small: 20,
      medium: 30,
      large: 40
    }
  },

  // Configurações de animação
  animation: {
    duration: 1000,     // Duração em ms
    easing: 'ease'      // Tipo de easing
  }
};

/**
 * Formata coordenadas para exibição
 */
export const formatCoordinates = (lng: number, lat: number): string => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

/**
 * Converte pontos do backend para formato GeoJSON
 */
export const pointsToGeoJSON = (points: any[]) => {
  return {
    type: 'FeatureCollection' as const,
    features: points.map(point => ({
      type: 'Feature' as const,
      properties: {
        id: point.id,
        type: point.type,
        quantity: point.quantity,
        date: point.date,
        behaviors: point.behaviors
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [point.lng, point.lat]
      }
    }))
  };
};

/**
 * Retorna a cor baseada no tipo de ponto
 */
export const getMarkerColor = (type: string): string => {
  switch (type) {
    case 'nest':
      return MAP_CONFIG.colors.nest;
    case 'feeding':
      return MAP_CONFIG.colors.feeding;
    case 'sighting':
    default:
      return MAP_CONFIG.colors.sighting;
  }
};

/**
 * Cria HTML para popup de marcador
 */
export const createPopupHTML = (point: any): string => {
  const typeLabel = point.type === 'nest'
    ? 'Ninho'
    : point.type === 'feeding'
    ? 'Área de Alimentação'
    : 'Avistamento';

  return `
    <div style="padding: 8px; font-family: system-ui;">
      <strong style="color: #125ED0; font-size: 14px;">
        ${typeLabel}
      </strong>
      ${point.quantity ? `
        <p style="margin: 4px 0 0 0; font-size: 12px;">
          ${point.quantity} indivíduo${point.quantity > 1 ? 's' : ''}
        </p>
      ` : ''}
      ${point.date ? `
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">
          ${new Date(point.date).toLocaleDateString('pt-BR')}
        </p>
      ` : ''}
      ${point.behaviors && point.behaviors.length > 0 ? `
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">
          ${point.behaviors.join(', ')}
        </p>
      ` : ''}
    </div>
  `;
};
