
import React, { useState, useCallback } from 'react';
import { MapProvider } from '../components/map/MapProvider';
import { Sidebar } from '../components/sidebar/Sidebar';
import { MapContainer } from '../components/map/MapContainer';
import { LayerControl } from '../components/layers/LayerControl';
import { TimelineControl } from '../components/timeline/TimelineControl';
import { useLayerStore } from '../hooks/useLayerStore';
import { Menu, X } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState({ month: 1, year: 2022 });
  const { layers, addLayer, removeLayer, updateLayer, reorderLayers } = useLayerStore();

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleDateChange = useCallback((month, year) => {
    setSelectedDate({ month, year });
  }, []);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        fixed lg:relative z-40 h-full
      `}>
        <Sidebar
          onAddLayer={addLayer}
          selectedDate={selectedDate}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <MapProvider>
          {/* Map */}
          <div className="flex-1 relative">
            <MapContainer
              layers={layers}
              selectedDate={selectedDate}
              onLayerUpdate={updateLayer}
            />
            
            {/* Layer Control Panel */}
            <div className="absolute top-4 right-4 z-10">
              <LayerControl
                layers={layers}
                onRemoveLayer={removeLayer}
                onUpdateLayer={updateLayer}
                onReorderLayers={reorderLayers}
              />
            </div>

            {/* Timeline Control */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <TimelineControl
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                minYear={2022}
                maxYear={2024}
              />
            </div>
          </div>
        </MapProvider>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
