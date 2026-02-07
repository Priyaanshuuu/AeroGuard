import { useEffect, useState } from 'react';
import { UnitSchema, type Unit } from '@/lib/schema'

export function useUnitSocket() {
  const [units, setUnits] = useState<Record<string, Unit>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("🔌 Attempting WebSocket Connection...");
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/units/');

    socket.onopen = () => {
      console.log('✅ WebSocket Connected!');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      // LOG THE RAW DATA
      console.log("📩 Raw Message received:", event.data);
      
      try {
        const data = JSON.parse(event.data);
        console.log("📦 Parsed Data:", data);

        const result = UnitSchema.safeParse(data);
        if (!result.success) {
          console.error("❌ Zod validation failed:", result.error);
          return;
        }

        const validUnit = result.data;
        setUnits((prev) => {
          const newState = { ...prev, [validUnit.unit_id]: validUnit };
          console.log("📊 Updated State:", newState);
          return newState;
        });
      } catch (e) {
        console.error("❌ JSON Parse Error:", e);
      }
    };

    socket.onclose = () => {
      console.log('⚠️ WebSocket Disconnected');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('🚨 WebSocket Error:', error);
    };

    return () => socket.close();
  }, []);

  return { units: Object.values(units), isConnected };
}