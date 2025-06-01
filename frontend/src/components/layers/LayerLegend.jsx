import React from 'react';

export const LayerLegend = ({ legend, layerName }) => {
  // Use default colors if not provided
  const colors = legend?.colors || [
    'rgb(0,0,255)',
    'rgb(0,255,255)',
    'rgb(0,255,0)',
    'rgb(255,255,0)',
    'rgb(255,128,0)',
    'rgb(255,0,0)'
  ];

  return (
    <div className="p-3 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-900 mb-2">
        {legend?.title || layerName || "Legend"}
      </h4>
      <div className="space-y-2">
        <div
          className="h-4 rounded"
          style={{
            background: `linear-gradient(to right, ${colors.join(', ')})`
          }}
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};
