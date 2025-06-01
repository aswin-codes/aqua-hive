import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMap } from './MapProvider';

const MAP_STYLES = {
  'LIGHT': {
    name: 'Light Mode',
    style: {
      version: 8,
      sources: {
        'cartodb': {
          type: 'raster',
          tiles: ['https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© CartoDB contributors'
        }
      },
      layers: [{
        id: 'cartodb-light',
        type: 'raster',
        source: 'cartodb',
        minzoom: 0,
        maxzoom: 19
      }]
    }
  },
  'DARK': {
    name: 'Dark Mode',
    style: {
      version: 8,
      sources: {
        'cartodb': {
          type: 'raster',
          tiles: ['https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© CartoDB contributors'
        }
      },
      layers: [{
        id: 'cartodb-dark',
        type: 'raster',
        source: 'cartodb',
        minzoom: 0,
        maxzoom: 19
      }]
    }
  },
  'OSM': {
    name: 'OpenStreetMap',
    style: {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [{
        id: 'osm-tiles',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19
      }]
    }
  },
  'SATELLITE': {
    name: 'Satellite',
    style: {
      version: 8,
      sources: {
        'satellite': {
          type: 'raster',
          tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: '© Esri'
        }
      },
      layers: [{
        id: 'satellite-tiles',
        type: 'raster',
        source: 'satellite',
        minzoom: 0,
        maxzoom: 19
      }]
    }
  }
};

export const MapContainer = ({ layers, selectedDate, onLayerUpdate }) => {
  const mapContainer = useRef(null);
  const { mapRef } = useMap();
  const [selectedStyle, setSelectedStyle] = useState('DARK');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new Map({
      container: mapContainer.current,
      style: MAP_STYLES[selectedStyle].style,
      center: [78.9629, 20.5937],
      zoom: 4,
      maxZoom: 18,
      minZoom: 1
    });

    map.addControl(new NavigationControl(), 'top-right');

    map.on('load', () => {
      console.log('Map loaded successfully');
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapRef, selectedStyle]);

  // Handle style changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setStyle(MAP_STYLES[selectedStyle].style);
  }, [selectedStyle]);

  // Update layers when they change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const currentLayerIds = layers.map(layer => `precip-heatmap-${layer.id}`);
    const currentSourceIds = layers.map(layer => `precip-${layer.id}`);

    map.getStyle().layers.forEach(({ id }) => {
      if (id.startsWith('precip-heatmap-') && !currentLayerIds.includes(id)) {
        map.removeLayer(id);
      }
    });
    Object.keys(map.getStyle().sources).forEach(sourceId => {
      if (sourceId.startsWith('precip-') && !currentSourceIds.includes(sourceId)) {
        map.removeSource(sourceId);
      }
    });

    // Remove existing layers first
    layers.filter(l => l.visible).forEach(layer => {
      const layerId = `precip-heatmap-${layer.id}`;
      const sourceId = `precip-${layer.id}`;

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    });

    // Add active layers
    layers
      .filter(layer => layer.visible)
      .forEach(layer => {
        const layerId = `precip-heatmap-${layer.id}`;
        const sourceId = `precip-${layer.id}`;

        const monthStr = selectedDate.month.toString().padStart(2, '0');
        const sourceUrl = `https://hq8grl9p-8080.inc1.devtunnels.ms/data/precip_${monthStr}_${selectedDate.year}/{z}/{x}/{y}.pbf`;

        // Add source
        map.addSource(sourceId, {
          type: 'vector',
          tiles: [sourceUrl],
          minzoom: 0,
          maxzoom: 14
        });

        // Add layer
        map.addLayer({
          id: layerId,
          type: 'heatmap',
          source: sourceId,
          'source-layer': `precip_${monthStr}_${selectedDate.year}`, // <- dynamic source-layer name
          maxzoom: 14,
          paint: {
            // Weight by normalized precipitation value
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'precip_norm'],
              0, 0,
              1, 1
            ],
            // Intensity increases with zoom
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 0.7,
              14, 2
            ],
            // Color ramp for heatmap
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0,0,255,0)',
              0.1, 'rgb(0,255,255)',
              0.3, 'rgb(0,255,0)',
              0.5, 'rgb(255,255,0)',
              0.7, 'rgb(255,128,0)',
              1, 'rgb(255,0,0)'
            ],
            // Radius increases with zoom
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              14, 20
            ],
            // Opacity from layer.opacity (UI slider)
            'heatmap-opacity': layer.opacity !== undefined ? layer.opacity : 0.7
          }
        });


        // Debug: Log source and layer info
        console.log('Added layer:', {
          layerId,
          sourceUrl,
          sourceLayer: 'precipitation'
        });

        // Debug: Add event listener for tile loading errors
        map.on('error', (e) => {
          console.error('Map error:', e);
        });

        // Check if tiles are loading
        map.on('sourcedataloading', (e) => {
          console.log('Source data loading:', e);
        });
      });

  }, [layers, selectedDate, mapRef]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow">
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(MAP_STYLES).map(([id, style]) => (
            <option key={id} value={id}>
              {style.name}
            </option>
          ))}
        </select>
      </div>
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};
