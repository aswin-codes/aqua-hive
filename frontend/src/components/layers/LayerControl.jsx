
import React, { useState } from 'react';
import { LayerItem } from './LayerItem';
import { LayerLegend } from './LayerLegend';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

export const LayerControl = ({
  layers,
  onRemoveLayer,
  onUpdateLayer,
  onReorderLayers
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedLayerForLegend, setSelectedLayerForLegend] = useState(null);

  const visibleLayers = layers.filter(layer => layer.visible);

  if (layers.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-w-64 max-w-80">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Layers size={18} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Active Layers</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {visibleLayers.length}
          </span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {/* Layer List */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {layers.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No layers added yet
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {layers
                .sort((a, b) => b.order - a.order)
                .map((layer) => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    onRemove={() => onRemoveLayer(layer.id)}
                    onUpdate={(updates) => onUpdateLayer(layer.id, updates)}
                    onShowLegend={() => setSelectedLayerForLegend(
                      selectedLayerForLegend === layer.id ? null : layer.id
                    )}
                    showingLegend={selectedLayerForLegend === layer.id}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      {selectedLayerForLegend && (
        <div className="border-t border-gray-200 bg-red-500 p-5">
          {(() => {
            const layer = layers.find(l => l.id === selectedLayerForLegend);
            return layer?.legend ? (
              <LayerLegend  />
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};
