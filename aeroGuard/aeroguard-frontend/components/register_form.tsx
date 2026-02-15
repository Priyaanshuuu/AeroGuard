"use client";

import { useState } from "react";
import { Ambulance, Flame, Plane, Plus } from "lucide-react";

export default function RegisterUnit() {
  const [unitId, setUnitId] = useState("");
  const [unitType, setUnitType] = useState("AMBULANCE");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/units", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_id: unitId,
          unit_type: unitType,
          latitude: 26.1200,
          longitude: 85.3600,
          status: "AVAILABLE",
        }),
      });

      if (response.ok) {
        alert(`✅ ${unitId} Registered Successfully!`);
        setUnitId("");
      } else {
        const errorData = await response.json();
        alert(`❌ Failed: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("❌ Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-emerald-400" />
        Register New Vehicle
      </h3>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider">Unit ID (e.g. AMB-005)</label>
          <input
            type="text"
            required
            value={unitId}
            onChange={(e) => setUnitId(e.target.value.toUpperCase())}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white mt-1 focus:border-emerald-500 focus:outline-none"
            placeholder="Enter ID..."
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider">Vehicle Type</label>
          <select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white mt-1 focus:border-emerald-500 focus:outline-none"
          >
            <option value="AMBULANCE">🚑 Ambulance</option>
            <option value="FIRE_TRUCK">🔥 Fire Truck</option>
            <option value="DRONE">✈️ Emergency Drone</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Registering..." : "Add to Fleet"}
        </button>
      </form>
    </div>
  );
}