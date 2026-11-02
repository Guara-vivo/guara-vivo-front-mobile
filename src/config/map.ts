export type MapLayerId = 'all' | 'feeding' | 'nests';

export const MAP_CENTER = {
  lat: -24.4968,
  lng: -47.8425,
};

export const MAP_DEFAULT_ZOOM = 13;

export const MAP_REGION_DELTA = 0.01;

export const DEFAULT_REGION = {
  latitude: MAP_CENTER.lat,
  longitude: MAP_CENTER.lng,
  latitudeDelta: MAP_REGION_DELTA,
  longitudeDelta: MAP_REGION_DELTA,
};
