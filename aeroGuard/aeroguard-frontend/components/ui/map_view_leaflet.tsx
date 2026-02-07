"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet'; // To create custom HTML icons
import { renderToStaticMarkup } from 'react-dom/server'; // To convert React Icons to HTML
import { Ambulance, Activity } from 'lucide-react'; 


interface Unit {
  unit_id: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface MapViewProps {
  units: Unit[];
}

export default function MapViewLeaflet({ units }: MapViewProps) {
  
  const createIcon = (status: string) => {
    const colorClass = status === 'BUSY' ? 'text-red-500' : 'text-emerald-400';
    const bgClass = status === 'BUSY' ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-emerald-500/20 border-emerald-400';
    

    const iconMarkup = renderToStaticMarkup(
      <div className={`p-1 rounded-full border-2 shadow-lg ${bgClass}`}>
        <Ambulance className={`h-6 w-6 ${colorClass}`} />
      </div>
    );

    return divIcon({
      html: iconMarkup,
      className: 'bg-transparent', 
      iconSize: [40, 40], 
      iconAnchor: [20, 20], 
    });
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative z-0">
      <MapContainer 
        center={[26.1209, 85.3647]}
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        style={{ background: '#020617' }}
      >
       
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {units.map((unit) => (
          <Marker 
            key={unit.unit_id} 
            position={[unit.latitude, unit.longitude]}
            icon={createIcon(unit.status)}
          >
            <Popup className="custom-popup">
              <div className="text-slate-900 font-bold">
                {unit.unit_id} <br />
                <span className={unit.status === 'BUSY' ? 'text-red-600' : 'text-green-600'}>
                  {unit.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur p-3 rounded border border-slate-800 text-xs text-slate-200 z-1000">
        <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-emerald-400" /> Available
        </div>
        <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-red-500 animate-pulse" /> Busy
        </div>
      </div>
    </div>
  );
}