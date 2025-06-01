
import React, { useState } from 'react';
import { LayerSearch } from './LayerSearch';
import { LayerBrowser } from './LayerBrowser';
import { X } from 'lucide-react';

export const Sidebar = ({ onAddLayer, selectedDate, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-80 h-full bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Data Explorer</h1>
          <p className="text-sm text-gray-600">Discover and visualize data</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <LayerSearch
          query={searchQuery}
          onQueryChange={setSearchQuery}
        />
      </div>

      {/* Browser */}
      <div className="flex-1 overflow-y-auto">
        <LayerBrowser
          searchQuery={searchQuery}
          onAddLayer={onAddLayer}
          selectedDate={selectedDate}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>Data from various sources • Vector tiles via TileServer-GL</p>
      </div>
    </div>
  );
};
