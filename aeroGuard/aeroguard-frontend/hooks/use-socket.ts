import { useEffect  , useState } from "react";
import { UnitSchema , type Unit } from "@/lib/schema";
import { saveUnitToDB , getAllUnitsFromDB } from "@/lib/db";

export function useUnitSocket (){
    const [units , setUnits] = useState<Record<string, Unit>>({});
    const [isConnected , setIsConnected] = useState(false);

    useEffect(()=>{
        async function loadCachedata(){
            const cachedUnits = await getAllUnitsFromDB();
            if(cachedUnits.length > 0) {
                console.log(`Loaded ${cachedUnits.length} units from Offline Storage`);

                const unitMap: Record<string , Unit> = {};
                cachedUnits.forEach(u => unitMap[u.unit_id]);
                setUnits(unitMap);
            }
        }
        loadCachedata();
    } , []);

    useEffect(()=>{
        const socket = new WebSocket('ws://127.0.0.1:8000/ws/units/');
        socket.onopen = ()=> setIsConnected(true);
        socket.onclose = () => setIsConnected(false);

        socket.onmessage = async (event) => {
            try {
                const rawData = JSON.parse(event.data);
                const result = UnitSchema.safeParse(rawData);

                if(result.success){
                    const validUnit = result.data;

                   setUnits((prev)=> ({
                    ...prev,
                    [validUnit.unit_id] : validUnit
                   }));

                   await saveUnitToDB(validUnit);
                }
                
            } catch (error) {
                console.log("Socket Error" , error);
            }
        }
        return () => socket.close();
    } , [])

    return {units : Object.values(units) , isConnected}
}
