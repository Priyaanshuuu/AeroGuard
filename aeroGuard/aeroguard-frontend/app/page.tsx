"use client"; 

import { useUnitSocket } from "@/hooks/use-socket"; // Import our hook
// ... keep existing imports ...
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Ambulance, Flame, Plane, MapPin, Signal, WifiOff } from "lucide-react";
import dynamic from "next/dynamic";

export default function Home() {
  // Use the hook!
  const { units, isConnected } = useUnitSocket();
  const MapViewLeaflet = dynamic(() => import('@/components/ui/map_view_leaflet'), { 
  ssr: false, // Server Side Rendering = False
  loading: () => <div className="text-slate-500">Loading Map...</div>
});

  // Get icon and color based on unit type
  const getUnitIconAndColor = (unitType: string) => {
    const normalizedType = unitType?.toUpperCase() || "AMBULANCE";
    
    if (normalizedType.includes("FIRE")) {
      return {
        Icon: Flame,
        bgClass: "bg-orange-950/50",
        borderClass: "border-orange-900",
        iconColor: "text-orange-400"
      };
    } else if (normalizedType.includes("DRONE")) {
      return {
        Icon: Plane,
        bgClass: "bg-blue-950/50",
        borderClass: "border-blue-900",
        iconColor: "text-blue-400"
      };
    } else {
      return {
        Icon: Ambulance,
        bgClass: "bg-red-950/50",
        borderClass: "border-red-900",
        iconColor: "text-red-400"
      };
    }
  };

  return (
    <main className="flex h-screen w-full flex-col bg-slate-950 text-slate-50 overflow-hidden">
      
      {/* HEADER */}
      <header className="flex h-16 items-center border-b border-slate-800 bg-slate-950/50 px-6 backdrop-blur-xl z-50">
        <Activity className="mr-2 h-6 w-6 text-emerald-400" />
        <h1 className="text-xl font-bold tracking-tight">AeroGuard <span className="text-slate-500 font-normal">Disaster Response</span></h1>
        <div className="ml-auto flex items-center gap-4">
          {isConnected ? (
             <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-900 animate-pulse">
               <Signal className="mr-1 h-3 w-3" /> LIVE FEED
             </Badge>
          ) : (
             <Badge variant="outline" className="bg-red-950/30 text-red-400 border-red-900">
               <WifiOff className="mr-1 h-3 w-3" /> DISCONNECTED
             </Badge>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR - REAL TIME UNIT LIST */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm z-40 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-400">ACTIVE UNITS ({units.length})</h2>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {units.length === 0 && <p className="text-slate-600 text-sm text-center mt-10">Waiting for GPS signals...</p>}
              
              {units.map((unit) => {
                const { Icon, bgClass, borderClass, iconColor } = getUnitIconAndColor(unit.unit_type);
                return (
                <Card key={unit.unit_id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full ${bgClass} flex items-center justify-center border ${borderClass}`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{unit.unit_id}</p>
                        <Badge variant="secondary" className="text-[10px] h-5 bg-emerald-950 text-emerald-400">{unit.status}</Badge>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mt-1 font-mono">
                        <MapPin className="h-3 w-3 mr-1" /> 
                        {unit.latitude.toFixed(4)}, {unit.longitude.toFixed(4)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* MAIN AREA */}
        <div className="flex-1 relative bg-slate-950 p-4">
             <MapViewLeaflet units={units} />
        </div>

      </div>
    </main>
  );
}