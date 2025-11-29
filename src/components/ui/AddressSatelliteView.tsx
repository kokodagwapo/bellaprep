import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ExternalLink } from 'lucide-react';
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

interface AddressSatelliteViewProps {
  address: AddressDetails | null;
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const AddressSatelliteView: React.FC<AddressSatelliteViewProps> = ({
  address,
  isVisible,
  onClose,
  onConfirm
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize 3D satellite map
  useEffect(() => {
    if (!isVisible || !address?.coordinates || !mapContainer.current) {
      // Cleanup map when hidden
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      setMapLoaded(false);
      return;
    }

    const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
    if (!apiKey) {
      console.warn('Mapbox API key not found');
      return;
    }

    mapboxgl.accessToken = apiKey;

    // Initialize map with 3D satellite view
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [address.coordinates.longitude, address.coordinates.latitude],
      zoom: 18,
      pitch: 60,
      bearing: -17.6
    });

    mapRef.current = map;

    // Add 3D terrain
    map.on('load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 256,
        maxzoom: 14
      });
      
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      setMapLoaded(true);
    });

    // Add marker
    const marker = new mapboxgl.Marker({
      color: '#ef4444',
      scale: 1.2
    })
      .setLngLat([address.coordinates.longitude, address.coordinates.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="text-sm font-semibold">
              ${address.fullAddress || `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`}
            </div>
          `)
      )
      .addTo(map);

    markerRef.current = marker;

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isVisible, address]);

  if (!isVisible || !address) return null;

  const { longitude, latitude } = address.coordinates || {};
  const fullAddress = address.fullAddress || `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`.trim();

  const openInGoogleMaps = () => {
    if (longitude && latitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`, '_blank');
    }
  };

  const openInMapbox = () => {
    if (longitude && latitude) {
      window.open(`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ff0000(${longitude},${latitude})/${longitude},${latitude},14,0/800x600?access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`, '_blank');
    } else {
      const query = encodeURIComponent(fullAddress);
      window.open(`https://www.mapbox.com/search/?q=${query}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 rounded-xl overflow-hidden ring-1 ring-border/50 shadow-lg"
        >
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 border-b border-border/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Address Location</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {fullAddress}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                aria-label="Close satellite view"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Satellite Map */}
          <div className="relative bg-gray-100" style={{ height: '300px', minHeight: '300px' }}>
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-xs text-muted-foreground">Loading satellite view...</p>
                </div>
              </div>
            )}
            <div
              ref={mapContainer}
              className="w-full h-full"
              style={{ display: mapLoaded ? 'block' : 'none' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 border-t border-border/50 flex flex-col sm:flex-row gap-2">
            <button
              onClick={openInGoogleMaps}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Google Maps
            </button>
            <button
              onClick={openInMapbox}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors text-sm"
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
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <MapPin className="w-4 h-4" />
                Confirm Address
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddressSatelliteView;


