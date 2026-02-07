import { z } from 'zod';

export const UnitSchema = z.object({
  unit_id: z.string(),
  unit_type: z.string().optional().default("AMBULANCE"), // <--- THIS LINE
  latitude: z.number(),
  longitude: z.number(),
  status: z.enum(["AVAILABLE", "BUSY", "OFFLINE"]).default("AVAILABLE"),
});

export type Unit = z.infer<typeof UnitSchema>;