import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Ambulance, MapPin, Signal } from "lucide-react";

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col bg-slate-950 text-slate-50 overflow-hidden">
      
      {/* HEADER */}
      <header className="flex h-16 items-center border-b border-slate-800 bg-slate-950/50 px-6 backdrop-blur-xl z-50">
        <Activity className="mr-2 h-6 w-6 text-emerald-400" />
        <h1 className="text-xl font-bold tracking-tight">AeroGuard <span className="text-slate-500 font-normal">Disaster Response</span></h1>
        <div className="ml-auto flex items-center gap-4">
          <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-900 animate-pulse">
            <Signal className="mr-1 h-3 w-3" /> SYSTEM ONLINE
          </Badge>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR - UNIT LIST */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm z-40 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-400">ACTIVE UNITS</h2>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {/* DUMMY DATA FOR NOW */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-950/50 flex items-center justify-center border border-blue-900">
                      <Ambulance className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">AMB-00{i}</p>
                        <Badge variant="secondary" className="text-[10px] h-5 bg-emerald-950 text-emerald-400">AVAILABLE</Badge>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> Downtown Sector {i}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* MAIN AREA - THE MAP */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center">
          <div className="text-center space-y-4">
             <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 border border-slate-800 animate-ping">
                <MapPin className="h-8 w-8 text-slate-600" />
             </div>
             <p className="text-slate-500">Map Loading via Mapbox (Day 10)...</p>
          </div>
        </div>

      </div>
    </main>
  );
}