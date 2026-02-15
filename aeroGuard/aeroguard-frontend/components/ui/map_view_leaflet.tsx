"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet'; 
import { renderToStaticMarkup } from 'react-dom/server'; 
import { Ambulance, Flame, Plane } from 'lucide-react';
import { type Unit } from '@/lib/schema';
import { useState } from 'react';

interface MapViewProps {
  units: Unit[];
}

function EmergencyClickHandler(){
  const [emergencyPin , setEmergencyPin] = useState<{lat: number , lng: number} | null>(null);

  useMapEvents({
    click(e){
      const {lat , lng}  =e.latlng;
      setEmergencyPin({lat , lng});

      fetch('http://127.0.0.1:8000/api/units/dispatch/', {
        method : 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({latitude : lat , longitude : lng})
      })
      .then(res=> res.json())
      .then(data => {
        if(data.error){
          alert(`❌ ${data.error}`)
        }else{
          alert(`${data.message} (${data.distance_km} km away)`);
        }
      })
      .catch(err => console.log("Dispatch failed!!" , err));
    }
  })
  return emergencyPin ? (
    <Marker 
      position={[emergencyPin.lat, emergencyPin.lng]}
      icon={divIcon({
        html: `<div style="font-size: 24px; text-shadow: 0 0 10px red; animation: pulse 1.5s infinite;">⚠️</div>`,
        className: 'bg-transparent',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      })}
    />
  ) : null;
}

  export default function MapViewLeaflet({ units }: MapViewProps) {

  // Filter out units with invalid coordinates
  const validUnits = units.filter(unit => 
    unit.latitude !== undefined && 
    unit.longitude !== undefined &&
    unit.latitude !== null &&
    unit.longitude !== null &&
    unit.latitude !== 0 &&
    unit.longitude !== 0 &&
    !isNaN(unit.latitude) &&
    !isNaN(unit.longitude)
  );

  const createIcon = (status: string, type: string = "AMBULANCE") => {
    
    const isBusy = status === 'BUSY';
    const colorClass = isBusy ? 'text-red-500' : 'text-emerald-400';
    const bgClass = isBusy 
      ? 'bg-red-500/20 border-red-500 animate-pulse' 
      : 'bg-emerald-500/20 border-emerald-400';


    let IconComponent = Ambulance; 
    

    const normalizedType = type?.toUpperCase() || "AMBULANCE";

    if (normalizedType.includes("FIRE")) {
        IconComponent = Flame;
    } else if (normalizedType.includes("DRONE")) {
        IconComponent = Plane;
    }

    const iconMarkup = renderToStaticMarkup(
      <div className={`p-1 rounded-full border-2 shadow-lg ${bgClass} bg-slate-950`}>
        <IconComponent className={`h-5 w-5 ${colorClass}`} />
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
        center={[26.1209, 85.3647]} // Muzaffarpur Center
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        style={{ background: '#020617' }} 
      >
   
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <EmergencyClickHandler />

   
        {validUnits.map((unit) => (
          <Marker 
            key={unit.unit_id} 
            position={[unit.latitude, unit.longitude]}
        
            icon={createIcon(unit.status, unit.unit_type)} 
          >
            <Popup className="custom-popup">
              <div className="text-slate-900 font-bold min-w-30">
                <div className="flex items-center gap-2 mb-1">
                
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