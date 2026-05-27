export type MapLayerId = 'all' | 'feeding' | 'nests';

export type MapRecord = {
  id: number;
  images: string;
  latitude_camera: number;
  longitude_camera: number;
  behavior: string;
  date_time: string;
  user_id: number;
};

export type MapZone = {
  id: number;
  type: 'feeding' | 'nest';
  latitude: number;
  longitude: number;
  radius_meters: number;
  user_id: number;
  created_at: string;
};

export const MAP_CENTER = {
  lat: -24.4968,
  lng: -47.8425,
};

export const MAP_DEFAULT_ZOOM = 13;

export const MAP_RECORDS: MapRecord[] = [
  {
    id: 1,
    images: 'nest-01.jpg',
    latitude_camera: -24.4959,
    longitude_camera: -47.8431,
    behavior: 'Ninhando',
    date_time: '2026-05-12T15:30:00Z',
    user_id: 12,
  },
  {
    id: 2,
    images: 'nest-02.jpg',
    latitude_camera: -24.4974,
    longitude_camera: -47.8418,
    behavior: 'Ninhando',
    date_time: '2026-05-11T08:15:00Z',
    user_id: 12,
  },
  {
    id: 3,
    images: 'nest-03.jpg',
    latitude_camera: -24.4983,
    longitude_camera: -47.8442,
    behavior: 'Ninhando',
    date_time: '2026-05-10T17:45:00Z',
    user_id: 12,
  },
  {
    id: 4,
    images: 'feed-01.jpg',
    latitude_camera: -24.4948,
    longitude_camera: -47.8409,
    behavior: 'Alimentando',
    date_time: '2026-05-09T11:20:00Z',
    user_id: 12,
  },
];

export const MAP_ZONES: MapZone[] = [
  {
    id: 1,
    type: 'nest',
    latitude: -24.4959,
    longitude: -47.8431,
    radius_meters: 200,
    user_id: 12,
    created_at: '2026-05-01T10:00:00Z',
  },
  {
    id: 2,
    type: 'nest',
    latitude: -24.4974,
    longitude: -47.8418,
    radius_meters: 250,
    user_id: 12,
    created_at: '2026-05-02T10:00:00Z',
  },
  {
    id: 3,
    type: 'feeding',
    latitude: -24.4948,
    longitude: -47.8409,
    radius_meters: 300,
    user_id: 12,
    created_at: '2026-05-03T10:00:00Z',
  },
  {
    id: 4,
    type: 'feeding',
    latitude: -24.4983,
    longitude: -47.8442,
    radius_meters: 280,
    user_id: 12,
    created_at: '2026-05-04T10:00:00Z',
  },
];

export const MAP_LAYER_LABELS: Record<MapLayerId, string> = {
  all: '247 registros',
  feeding: '89 áreas',
  nests: '12 ninhos',
};
