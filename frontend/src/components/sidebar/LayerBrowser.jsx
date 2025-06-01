
import React from 'react';
import { Plus, Calendar, Droplets } from 'lucide-react';

export const LayerBrowser = ({ searchQuery, onAddLayer, selectedDate }) => {
  const availableLayers = [
    {
      name: 'Precipitation Data',
      description: 'Monthly precipitation data from 2022-2024',
      type: 'precipitation',
      category: 'Climate',
      sourceUrl: 'http://localhost:8080/data/precip_01_2022/{z}/{x}/{y}.pbf',
      sourceLayer: 'precipitation',
      style: {
        fillColor: [
          'interpolate',
          ['linear'],
          ['get', 'precipitation'],
          0, '#f7fbff',
          50, '#deebf7',
          100, '#c6dbef',
          200, '#9ecae1',
          300, '#6baed6',
          400, '#4292c6',
          500, '#2171b5',
          600, '#08519c',
          800, '#08306b'
        ]
      },
      legend: {
        title: 'Precipitation (mm)',
        type: 'gradient',
        colors: ['#f7fbff', '#08306b'],
        labels: ['0mm', '800mm+']
      }
    }
  ];

  const filteredLayers = availableLayers.filter(layer =>
    layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    layer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    layer.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLayer = (layerData) => {
    const monthStr = selectedDate.month.toString().padStart(2, '0');
    const updatedSourceUrl = layerData.type === 'precipitation' 
      ? `http://localhost:8080/data/precip_${monthStr}_${selectedDate.year}/{z}/{x}/{y}.pbf`
      : layerData.sourceUrl;

    onAddLayer({
      ...layerData,
      sourceUrl: updatedSourceUrl,
      visible: true,
      opacity: 0.7
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Datasets</h3>
        
        {filteredLayers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No datasets found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLayers.map((layer, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {layer.type === 'precipitation' && (
                      <Droplets className="text-blue-500" size={16} />
                    )}
                    <h4 className="font-medium text-gray-900 text-sm">{layer.name}</h4>
                  </div>
                  <button
                    onClick={() => handleAddLayer(layer)}
                    className="p-1 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-700"
                    title="Add to map"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{layer.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {layer.category}
                  </span>
                  {layer.type === 'precipitation' && (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar size={12} />
                      <span>
                        {selectedDate.month.toString().padStart(2, '0')}/{selectedDate.year}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
