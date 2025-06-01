
import React from 'react';
import { Eye, EyeOff, X, Info, Droplets } from 'lucide-react';

export const LayerItem = ({
  layer,
  onRemove,
  onUpdate,
  onShowLegend,
  showingLegend
}) => {
  const handleOpacityChange = (opacity) => {
    onUpdate({ opacity });
  };

  const toggleVisibility = () => {
    onUpdate({ visible: !layer.visible });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
      {/* Layer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {layer.type === 'precipitation' && (
            <Droplets size={14} className="text-blue-500 flex-shrink-0" />
          )}
          <span className="text-sm font-medium text-gray-900 truncate">
            {layer.name}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {layer.legend && (
            <button
              onClick={onShowLegend}
              className={`p-1 rounded hover:bg-gray-200 ${
                showingLegend ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title="Toggle legend"
            >
              <Info size={14} />
            </button>
          )}
          
          <button
            onClick={toggleVisibility}
            className={`p-1 rounded hover:bg-gray-200 ${
              layer.visible ? 'text-gray-600' : 'text-gray-400'
            }`}
            title={layer.visible ? 'Hide layer' : 'Show layer'}
          >
            {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          
          <button
            onClick={onRemove}
            className="p-1 rounded hover:bg-red-100 text-red-600 hover:text-red-700"
            title="Remove layer"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Opacity Slider */}
      {layer.visible && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Opacity</span>
            <span>{Math.round((layer.opacity || 0.7) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={layer.opacity || 0.7}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}
    </div>
  );
};
