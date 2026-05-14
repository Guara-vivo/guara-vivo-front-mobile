import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from '../config/map';
import type { MapLayerId, MapRecord } from '../config/map';

type Props = {
  selectedLayer: MapLayerId;
  records: MapRecord[];
};

function escapeHtml(value: string) {
  return value.replace(/</g, '\\u003c');
}

function buildHtml(center: { lat: number; lng: number }, records: MapRecord[]) {
  const serializedCenter = escapeHtml(JSON.stringify(center));
  const serializedRecords = escapeHtml(JSON.stringify(records));

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" />
    <style>
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        background: #f2f3f1;
        font-family: Arial, Helvetica, sans-serif;
      }

      #map {
        position: absolute;
        inset: 0;
        background: #f2f3f1;
      }

      .zoom-control {
        position: absolute;
        z-index: 3;
      }

      .zoom-control {
        top: 14px;
        right: 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .zoom-button {
        width: 28px;
        height: 38px;
        border-radius: 10px;
        border: 1.5px solid #7aa7ff;
        background: #ffffff;
        color: #125ed0;
        font-size: 21px;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      }

      .count-badge {
        position: absolute;
        right: 14px;
        bottom: 14px;
        z-index: 3;
        background: rgba(255, 255, 255, 0.96);
        color: #1a1a1a;
        border-radius: 10px;
        padding: 7px 10px;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      }

      .count-badge strong {
        color: #F2201F;
      }

      .custom-marker {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-2px);
        filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
      }

      .custom-marker.nest {
        color: #F2201F;
      }

      .custom-marker.feeding {
        color: #125ED0;
      }

      .custom-marker svg {
        width: 24px;
        height: 24px;
      }

    </style>
    <script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
  </head>
  <body>
    <div id="map"></div>
    <div class="zoom-control">
      <button class="zoom-button" id="zoom-in" type="button">+</button>
      <button class="zoom-button" id="zoom-out" type="button">−</button>
    </div>
    <div class="count-badge"><strong id="count-value">0</strong> <span id="count-label">registros</span></div>

    <script>
      const mapCenter = ${serializedCenter};
      const allRecords = ${serializedRecords};
      const baseStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

      const map = new maplibregl.Map({
        container: 'map',
        style: baseStyle,
        center: [mapCenter.lng, mapCenter.lat],
        zoom: ${MAP_DEFAULT_ZOOM},
        attributionControl: true
      });

      const zoomInButton = document.getElementById('zoom-in');
      const zoomOutButton = document.getElementById('zoom-out');
      const countValue = document.getElementById('count-value');
      const countLabel = document.getElementById('count-label');
      const markerLayer = [];
      let currentLayer = 'all';
      let selectedLayer = 'all';

      function layerTitle(layer) {
        if (layer === 'feeding') {
          return 'alimentação';
        }

        if (layer === 'nests') {
          return 'ninhos';
        }

        return 'registros';
      }

      function recordLayer(record) {
        const behavior = String(record.behavior || '').toLowerCase();

        if (behavior.includes('ninh')) {
          return 'nests';
        }

        if (behavior.includes('aliment')) {
          return 'feeding';
        }

        return 'all';
      }

      function filteredRecords(layer) {
        if (layer === 'all') {
          return allRecords;
        }

        return allRecords.filter((record) => recordLayer(record) === layer);
      }

      function updateCountBadge(layer) {
        const count = filteredRecords(layer).length;
        countValue.textContent = String(count);
        countLabel.textContent = layerTitle(layer);
      }

      function markerSvg(layer) {
        if (layer === 'feeding') {
          return [
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">',
            '<path d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />',
            '<circle cx="12" cy="11" r="2.2" stroke="currentColor" stroke-width="1.8" />',
            '</svg>',
          ].join('');
        }

        return [
          '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">',
          '<path d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />',
          '<path d="M9.5 12.2h5M9.5 9.8h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />',
          '</svg>',
        ].join('');
      }

      function clearMarkers() {
        while (markerLayer.length) {
          const marker = markerLayer.pop();
          marker.remove();
        }
      }

      function renderLayer(layer) {
        currentLayer = layer;
        clearMarkers();
        updateCountBadge(layer);

        filteredRecords(layer).forEach((record) => {
          const recordLayerName = recordLayer(record);
          const element = document.createElement('div');
          element.className = 'custom-marker' + (recordLayerName === 'nests' ? ' nest' : ' feeding');
          element.innerHTML = markerSvg(recordLayerName);

          const marker = new maplibregl.Marker({ element, anchor: 'bottom' })
            .setLngLat([record.longitude_camera, record.latitude_camera])
            .addTo(map);

          markerLayer.push(marker);
        });
      }

      function muteStyleLayers() {
        const hideLayerIds = [
          'road_path',
          'poi_stadium',
          'poi_park',
          'aeroway-runway',
          'aeroway-taxiway',
          'tunnel_path',
          'bridge_path',
          'rail',
          'rail_dash'
        ];

        hideLayerIds.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', 'none');
          }
        });

        const layers = map.getStyle().layers || [];
        layers.forEach((layer) => {
          if (layer.id.startsWith('poi_') || layer.id.startsWith('aeroway-')) {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
          }
        });

        ['roadname_minor', 'roadname_sec', 'roadname_pri', 'roadname_major', 'housenumber'].forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'text-color', '#8A8A8A');
            map.setPaintProperty(layerId, 'text-halo-color', '#F7F7F5');
          }
        });

        ['water', 'landuse', 'landcover', 'building', 'building-top'].forEach((layerId) => {
          if (map.getLayer(layerId)) {
            if (layerId === 'water') {
              map.setPaintProperty(layerId, 'fill-color', '#DADDDC');
            }
            if (layerId === 'landcover' || layerId === 'landuse' || layerId === 'building' || layerId === 'building-top') {
              map.setPaintProperty(layerId, 'fill-opacity', 0.22);
            }
          }
        });
      }

      map.on('load', () => {
        muteStyleLayers();
        renderLayer(currentLayer);
      });

      map.on('styledata', () => {
        muteStyleLayers();
      });

      zoomInButton.addEventListener('click', () => {
        map.zoomTo(Math.min(map.getZoom() + 1, 20), { duration: 160 });
      });

      zoomOutButton.addEventListener('click', () => {
        map.zoomTo(Math.max(map.getZoom() - 1, 1), { duration: 160 });
      });

      window.__setMapLayer = function(layer) {
        selectedLayer = layer;
        renderLayer(layer);
      };
    </script>
  </body>
</html>`;
}

export function MapLibreMapView({ selectedLayer, records }: Props) {
  const webViewRef = useRef<WebView>(null);
  const [mapCenter, setMapCenter] = useState(MAP_CENTER);
  const [locationReady, setLocationReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentLocation = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) {
          if (isMounted) {
            setLocationReady(true);
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted) {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationReady(true);
        }
      } catch {
        if (isMounted) {
          setLocationReady(true);
        }
      }
    };

    loadCurrentLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const html = useMemo(() => buildHtml(mapCenter, records), [mapCenter, records]);

  useEffect(() => {
    webViewRef.current?.injectJavaScript(`window.__setMapLayer && window.__setMapLayer('${selectedLayer}'); true;`);
  }, [selectedLayer]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        key={`${mapCenter.lat}-${mapCenter.lng}`}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        style={styles.webView}
      />
      {!locationReady ? <View style={styles.loadingOverlay} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 430,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#DCE9FB',
  },
  webView: {
    flex: 1,
    backgroundColor: '#DCE9FB',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 233, 251, 0.12)',
  },
});
