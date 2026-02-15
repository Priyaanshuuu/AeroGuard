"use client"; 

import { useUnitSocket } from "@/hooks/use-socket"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Ambulance, Flame, Plane, MapPin, Signal, WifiOff } from "lucide-react";
import dynamic from "next/dynamic";
import RegisterUnit from "@/components/register_form";

export default function Home() {
 
  const { units, isConnected } = useUnitSocket();
  const MapViewLeaflet = dynamic(() => import('@/components/ui/map_view_leaflet'), { 
  ssr: false, 
  loading: () => <div className="text-slate-500">Loading Map...</div>
});

 
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
      <RegisterUnit/>
      
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
        
        <aside className="w-80 border-r border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 backdrop-blur-sm z-40 flex flex-col shadow-lg">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <h2 className="text-lg font-bold text-emerald-400 tracking-wider">ACTIVE UNITS ({units.length})</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time Fleet Status</p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {units.length === 0 && <p className="text-slate-400 text-sm text-center mt-10 font-semibold">Waiting for GPS signals...</p>}
              
              {units.map((unit) => {
                const { Icon, bgClass, borderClass, iconColor } = getUnitIconAndColor(unit.unit_type);
                const statusColor = unit.status === 'BUSY' 
                  ? 'bg-red-500/20 border-red-400 text-red-300' 
                  : 'bg-emerald-500/20 border-emerald-400 text-emerald-300';
                
                return (
                <Card key={unit.unit_id} className="bg-slate-700/40 border border-slate-600 hover:border-emerald-400 hover:bg-slate-700/60 transition-all shadow-md">
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full ${bgClass} flex items-center justify-center border-2 ${borderClass} flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-slate-100 truncate">{unit.unit_id}</p>
                      </div>
                      <Badge className={`text-[11px] font-semibold border ${statusColor}`}>
                        {unit.status === 'BUSY' ? '🔴 BUSY' : '🟢 AVAILABLE'}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-300 mt-2 font-mono bg-slate-800/50 px-2 py-1 rounded">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" /> 
                        <span className="truncate">{unit.latitude.toFixed(4)}, {unit.longitude.toFixed(4)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          </ScrollArea>
        </aside>

        <div className="flex-1 relative bg-slate-950 overflow-hidden">
             <MapViewLeaflet units={units} />
        </div>

      </div>
    </main>
  );
}