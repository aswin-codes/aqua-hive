
import React, { createContext, useContext, useRef } from 'react';

const MapContext = createContext(null);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within MapProvider');
  }
  return context;
};

export const MapProvider = ({ children }) => {
  const mapRef = useRef(null);

  return (
    <MapContext.Provider value={{ mapRef }}>
      {children}
    </MapContext.Provider>
  );
};
