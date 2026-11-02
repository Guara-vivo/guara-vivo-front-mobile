// Estilo do Google Maps: esconde POIs comerciais e deixa o mapa neutro.
export const mapStyle = [
	{
		featureType: 'poi',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.business',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.government',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.medical',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'poi.school',
		elementType: 'all',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'transit',
		elementType: 'labels',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.icon',
		stylers: [{ visibility: 'off' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#8d94a0' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.stroke',
		stylers: [{ color: '#f5f5f5' }],
	},
	{
		featureType: 'landscape',
		elementType: 'geometry',
		stylers: [{ color: '#f3f4f6' }],
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [{ color: '#dfe6ee' }],
	},
]
