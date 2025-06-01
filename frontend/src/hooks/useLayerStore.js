
import { useState, useCallback } from 'react';

export const useLayerStore = () => {
  const [layers, setLayers] = useState([]);

  const addLayer = useCallback((layerData) => {
    const newLayer = {
      ...layerData,
      id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: layers.length
    };
    
    setLayers(prev => [...prev, newLayer]);
    console.log('Added layer:', newLayer.name);
  }, [layers.length]);

  const removeLayer = useCallback((layerId) => {
    setLayers(prev => {
      const filtered = prev.filter(layer => layer.id !== layerId);
      console.log(`Removed layer: ${layerId}`);
      return filtered;
    });
  }, []);

  const updateLayer = useCallback((layerId, updates) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, ...updates }
        : layer
    ));
  }, []);

  const reorderLayers = useCallback((layerIds) => {
    setLayers(prev => {
      const reordered = layerIds.map((id, index) => {
        const layer = prev.find(l => l.id === id);
        return layer ? { ...layer, order: index } : null;
      }).filter(Boolean);
      
      return reordered;
    });
  }, []);

  return {
    layers,
    addLayer,
    removeLayer,
    updateLayer,
    reorderLayers
  };
};
