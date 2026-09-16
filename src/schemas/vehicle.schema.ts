import { z } from "zod"

export const vehicleSchema= z.object({
    vehicle_id: z.int(),
    vehicle_type: z.enum([
        "AC",
        "Non-AC"
    ]),
    vehicle_manufactured_year : z.int(),
    vehicle_manufacturer : z.string(),
    vehicle_model: z.string(),
    seat_capacity :z.int(),
    vehicle_status : z.enum([
        "active",
        "retired",
        "under_maintainance"
    ])
})