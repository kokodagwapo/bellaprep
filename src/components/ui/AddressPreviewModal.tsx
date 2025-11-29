import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface AddressDetails {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  fullAddress?: string;
  coordinates?: {
    longitude: number;
    latitude: number;
  };
  verified?: boolean;
}

interface AddressPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: AddressDetails | null;
  onConfirm?: () => void;
}

const AddressPreviewModal: React.FC<AddressPreviewModalProps> = ({
  isOpen,
  onClose,
  address,
  onConfirm
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize 3D satellite map
  useEffect(() => {
    if (!isOpen || !address?.coordinates || !mapContainer.current) return;

    const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
    if (!apiKey) {
      console.warn('Mapbox API key not found');
      return;
    }

    mapboxgl.accessToken = apiKey;

    // Initialize map with 3D satellite view
    if (!address.coordinates) return;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite imagery with street labels
      center: [address.coordinates.longitude, address.coordinates.latitude],
      zoom: 17, // Close zoom for detail
      pitch: 60, // 3D tilt angle (0-60 degrees)
      bearing: -17.6, // Rotation angle
      antialias: true, // Smooth rendering
      attributionControl: false // Hide default attribution (we'll add custom)
    });

    mapRef.current = map;

    // Add 3D terrain when map loads
    map.on('load', () => {
      // Add terrain source for 3D elevation
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });

      // Set terrain with exaggeration for better 3D effect
      map.setTerrain({ 
        source: 'mapbox-dem', 
        exaggeration: 1.5 // Makes terrain more pronounced
      });

      // Add marker at address location
      if (address.coordinates) {
        const marker = new mapboxgl.Marker({
          color: '#ef4444', // Red color
          scale: 1.2
        })
          .setLngLat([address.coordinates.longitude, address.coordinates.latitude])
          .addTo(map);

        markerRef.current = marker;

        // Add popup with address
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat([address.coordinates.longitude, address.coordinates.latitude])
          .setHTML(`
            <div class="p-2">
              <p class="font-semibold text-sm">${address.fullAddress || `${address.street}, ${address.city}, ${address.state} ${address.zip}`}</p>
            </div>
          `)
          .addTo(map);
      }

      setMapLoaded(true);
    });

    // Cleanup on unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen, address]);

  const openInGoogleMaps = () => {
    if (!address) return;
    const query = encodeURIComponent(address.fullAddress || `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const openInMapbox = () => {
    if (!address) return;
    if (address.coordinates) {
      const { longitude, latitude } = address.coordinates;
      window.open(`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ff0000(${longitude},${latitude})/${longitude},${latitude},14,0/800x600?access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`, '_blank');
    } else {
      const query = encodeURIComponent(address.fullAddress || `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`);
      window.open(`https://www.mapbox.com/search/?query=${query}`, '_blank');
    }
  };

  if (!isOpen || !address) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && address && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
            style={{ position: 'fixed' }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-[10000]"
              style={{ position: 'relative', zIndex: 10000 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Address Preview</h3>
                    <p className="text-xs text-gray-500">Verify and confirm address</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* 3D Satellite Map */}
              {address.coordinates && (
                <div className="relative w-full h-64 sm:h-80 bg-gray-200">
                  <div 
                    ref={mapContainer} 
                    className="w-full h-full rounded-t-2xl"
                    style={{ minHeight: '256px' }}
                  />
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-t-2xl">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Loading 3D satellite view...</p>
                      </div>
                    </div>
                  )}
                  {/* Mapbox attribution */}
                  <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                    © Mapbox © Maxar
                  </div>
                </div>
              )}

              {/* Content - Scrollable */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Verification Status */}
                {address.verified && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-800 font-medium">Address verified with Mapbox</p>
                  </div>
                )}

                {/* Address Details */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Address</label>
                    <p className="mt-1 text-base text-gray-900 font-medium">{address.fullAddress || `${address.street}, ${address.city}, ${address.state} ${address.zip}`}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    {address.street && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Street</label>
                        <p className="mt-1 text-sm text-gray-900">{address.street}</p>
                      </div>
                    )}
                    {address.city && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</label>
                        <p className="mt-1 text-sm text-gray-900">{address.city}</p>
                      </div>
                    )}
                    {address.state && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">State</label>
                        <p className="mt-1 text-sm text-gray-900">{address.state}</p>
                      </div>
                    )}
                    {address.zip && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ZIP Code</label>
                        <p className="mt-1 text-sm text-gray-900">{address.zip}</p>
                      </div>
                    )}
                  </div>

                  {address.coordinates && (
                    <div className="pt-2 border-t border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Coordinates</label>
                      <p className="mt-1 text-sm text-gray-600 font-mono">
                        {address.coordinates.latitude.toFixed(6)}, {address.coordinates.longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={openInGoogleMaps}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Google Maps
                  </button>
                  <button
                    onClick={openInMapbox}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Mapbox
                  </button>
                  {onConfirm && (
                    <button
                      onClick={() => {
                        onConfirm();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors mt-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Address
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddressPreviewModal;

