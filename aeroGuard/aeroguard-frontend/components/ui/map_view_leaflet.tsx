"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet'; 
import { renderToStaticMarkup } from 'react-dom/server'; 
import { Ambulance, Flame, Plane } from 'lucide-react'; // Added Flame & Plane
import { type Unit } from '@/lib/schema'; // Import the Zod Type

interface MapViewProps {
  units: Unit[];
}

  export default function MapViewLeaflet({ units }: MapViewProps) {
  
  // --- CUSTOM ICON GENERATOR ---
  const createIcon = (status: string, type: string = "AMBULANCE") => {
    
    // 1. Determine Color (Red for Busy, Green for Available)
    const isBusy = status === 'BUSY';
    const colorClass = isBusy ? 'text-red-500' : 'text-emerald-400';
    const bgClass = isBusy 
      ? 'bg-red-500/20 border-red-500 animate-pulse' 
      : 'bg-emerald-500/20 border-emerald-400';

    // 2. Determine Icon Shape based on Vehicle Type
    let IconComponent = Ambulance; // Default
    
    // Normalize string to handle "Fire_Truck" or "FIRE_TRUCK"
    const normalizedType = type?.toUpperCase() || "AMBULANCE";

    if (normalizedType.includes("FIRE")) {
        IconComponent = Flame;
    } else if (normalizedType.includes("DRONE")) {
        IconComponent = Plane;
    }

    // 3. Convert React Icon to HTML String for Leaflet
    const iconMarkup = renderToStaticMarkup(
      <div className={`p-1 rounded-full border-2 shadow-lg ${bgClass} bg-slate-950`}>
        <IconComponent className={`h-5 w-5 ${colorClass}`} />
      </div>
    );

    // 4. Return Leaflet Icon
    return divIcon({
      html: iconMarkup,
      className: 'bg-transparent', // Remove default white square
      iconSize: [40, 40], 
      iconAnchor: [20, 20], // Center the icon exactly on the lat/lon
    });
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative z-0">
      <MapContainer 
        center={[26.1209, 85.3647]} // Muzaffarpur Center
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        style={{ background: '#020617' }} 
      >
        {/* DARK THEME MAP TILES */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* RENDER ALL UNITS */}
        {units.map((unit) => (
          <Marker 
            key={unit.unit_id} 
            position={[unit.latitude, unit.longitude]}
            // Pass Status AND Type to get the right icon
            icon={createIcon(unit.status, unit.unit_type)} 
          >
            <Popup className="custom-popup">
              <div className="text-slate-900 font-bold min-w-30">
                <div className="flex items-center gap-2 mb-1">
                   {/* Mini Icon in Popup */}
                   {unit.unit_type?.includes("FIRE") ? <Flame className="h-4 w-4 text-orange-500"/> : 
                    unit.unit_type?.includes("DRONE") ? <Plane className="h-4 w-4 text-blue-500"/> : 
                    <Ambulance className="h-4 w-4 text-red-500"/>}
                   <span>{unit.unit_id}</span>
                </div>
                
                <div className="text-xs text-slate-500 font-mono mb-2">
                  {unit.latitude.toFixed(4)}, {unit.longitude.toFixed(4)}
                </div>

                <span className={`px-2 py-0.5 rounded text-xs text-white ${unit.status === 'BUSY' ? 'bg-red-500' : 'bg-green-600'}`}>
                  {unit.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* LEGEND OVERLAY */}
      <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur p-3 rounded border border-slate-800 text-xs text-slate-200 z-1000 shadow-xl">
        <h4 className="font-bold text-slate-400 mb-2 uppercase text-[10px] tracking-wider">Unit Status</h4>
        <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div> Available
        </div>
        <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> Busy
        </div>
      </div>
    </div>
  );
}