import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Star, Car } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function AttractionsLogic({ hotelLocation }: { hotelLocation: google.maps.LatLngLiteral }) {
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  const map = useMap();
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [routesInfo, setRoutesInfo] = useState<Record<string, { distance: string, duration: string }>>({});

  useEffect(() => {
    if (!placesLib || !map) return;
    
    // Using Place.searchNearby to find popular tourist attractions
    placesLib.Place.searchNearby({
      fields: ['displayName', 'location', 'formattedAddress', 'rating', 'photos', 'types'],
      locationRestriction: { center: hotelLocation, radius: 10000 },
      includedPrimaryTypes: ['tourist_attraction', 'historical_landmark', 'museum', 'park'],
      maxResultCount: 8,
    }).then(async ({ places }) => {
      setPlaces(places);
      
      if (routesLib && places.length > 0) {
        const routesPromises = places.map(async (place) => {
          if (!place.location) return { id: place.id, info: null };
          try {
            const { routes } = await routesLib.Route.computeRoutes({
              origin: hotelLocation,
              destination: place.location,
              travelMode: 'DRIVING',
              fields: ['distanceMeters', 'durationMillis'],
            });
            if (routes?.[0]) {
               return {
                 id: place.id,
                 info: {
                   distance: (routes[0].distanceMeters / 1000).toFixed(1) + ' km',
                   duration: Math.round(Number(routes[0].durationMillis) / 60000) + ' min',
                 }
               };
            }
          } catch(e) {
            console.error("Route error for", place.displayName, e);
          }
          return { id: place.id, info: null };
        });
        
        const results = await Promise.all(routesPromises);
        const newRoutesInfo: Record<string, { distance: string, duration: string }> = {};
        results.forEach(res => {
          if (res.info) newRoutesInfo[res.id] = res.info;
        });
        setRoutesInfo(newRoutesInfo);
      }
      setLoading(false);
      
      // Fit bounds
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(hotelLocation);
      places.forEach(p => {
        if (p.location) bounds.extend(p.location);
      });
      map.fitBounds(bounds, { bottom: 40, left: 40, right: 40, top: 40 });
    }).catch(err => {
      console.error("Error fetching places", err);
      setLoading(false);
    });
  }, [placesLib, routesLib, map, hotelLocation]);

  return (
    <>
      <AdvancedMarker position={hotelLocation} title="Our Hotel" zIndex={100}>
        <Pin background="#D9B673" glyphColor="#0A1024" borderColor="#0A1024" />
      </AdvancedMarker>
      
      {places.map(p => p.location && (
        <AdvancedMarker key={p.id} position={p.location} title={p.displayName}>
           <Pin background="#0A1024" glyphColor="#fff" borderColor="#D9B673" />
        </AdvancedMarker>
      ))}

      <div className="absolute top-4 left-4 right-4 md:right-auto md:w-96 bottom-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col z-10 border border-[#D9B673]/30">
        <div className="p-5 border-b border-gray-100 bg-white">
           <h2 className="text-[#0A1024] font-serif text-xl tracking-wide">Nearby Attractions</h2>
           <p className="text-gray-500 text-sm mt-1">Discover popular spots around the hotel</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                 <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0"></div>
                 <div className="flex-1 space-y-2 py-1">
                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                 </div>
              </div>
            ))
          ) : places.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No attractions found nearby.</div>
          ) : (
            places.map(place => (
              <div key={place.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden relative">
                  {place.photos && place.photos.length > 0 ? (
                    <img 
                      src={place.photos[0].getURI({ maxWidth: 200 })} 
                      alt={place.displayName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPin size={24} />
                    </div>
                  )}
                  {place.rating && (
                     <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur rounded px-1.5 py-0.5 flex items-center gap-1 text-[10px] font-bold text-gray-800">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                        {place.rating}
                     </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-sans font-bold text-sm text-[#0A1024] truncate mb-1">
                    {place.displayName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mb-2">
                    {place.formattedAddress}
                  </p>
                  
                  {routesInfo[place.id] && (
                    <div className="flex items-center gap-3 text-[11px] font-medium text-[#D9B673] bg-[#D9B673]/10 w-fit px-2 py-1 rounded">
                      <div className="flex items-center gap-1">
                        <Car size={12} />
                        {routesInfo[place.id].duration}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-[#D9B673]/40"></div>
                      <div>
                        {routesInfo[place.id].distance}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default function LocalAttractionsLayout({
  currentHotel,
  onBack,
}: {
  currentHotel: any;
  onBack: () => void;
}) {
  const hotelLocation = currentHotel?.content?.location || { lat: 34.7667, lng: 32.4167 };

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#0A1024] hover:bg-gray-50 hover:text-[#D9B673] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-[#0A1024] font-serif text-xl md:text-2xl tracking-wide uppercase">
              Local Attractions
            </h2>
            <div className="text-gray-500 text-xs tracking-wider uppercase">
              Discover {currentHotel?.name || "Our Hotel"}'s Surroundings
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {!hasValidKey ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-serif text-[#0A1024] mb-2">Maps API Key Required</h2>
              <p className="text-gray-500 text-sm mb-6">
                To view local attractions, please configure your Google Maps Platform API key in the AI Studio Secrets panel as `GOOGLE_MAPS_PLATFORM_KEY`.
              </p>
            </div>
          </div>
        ) : (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={hotelLocation}
              defaultZoom={13}
              mapId="ATTRACTIONS_MAP"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              disableDefaultUI={true}
              gestureHandling="greedy"
            >
              <AttractionsLogic hotelLocation={hotelLocation} />
            </Map>
          </APIProvider>
        )}
      </div>
    </div>
  );
}
