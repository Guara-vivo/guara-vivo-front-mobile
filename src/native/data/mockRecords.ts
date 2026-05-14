import type { RecordItem } from '../types/records';

export const behaviorOptions = ['Alimentando', 'Voando', 'Pousado', 'Ninhando', 'Em cio'];

export const mockRecords: RecordItem[] = [
  {
    id: 1,
    ibis_quantity: 3,
    flock_size: 'Alimentando',
    latitude: -24.4959,
    longitude: -47.8431,
    datetime: '2026-05-11T15:30:00Z',
  },
  {
    id: 2,
    ibis_quantity: 5,
    flock_size: 'Ninhando',
    latitude: -24.4974,
    longitude: -47.8418,
    datetime: '2026-05-10T08:15:00Z',
  },
  {
    id: 3,
    ibis_quantity: 2,
    flock_size: 'Voando',
    latitude: -24.4983,
    longitude: -47.8442,
    datetime: '2026-05-09T17:45:00Z',
  },
  {
    id: 4,
    ibis_quantity: 4,
    flock_size: 'Pousado',
    latitude: -24.4948,
    longitude: -47.8409,
    datetime: '2026-05-08T06:20:00Z',
  },
];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '--/--/----';
  }

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatLocationLabel(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}
