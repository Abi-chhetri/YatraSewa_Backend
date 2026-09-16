import { describe, expect, it } from "vitest";
import { vehicleSchema } from "../src/schemas/vehicle.schema"


describe("Vehicle Schema", () => {
  it("should accept valid vehicle data", () => {
    const vehicle = {
      vehicle_id: 1,
      vehicle_type: "AC",
      vehicle_manufactured_year: 2024,
      vehicle_manufacturer: "Toyota",
      vehicle_model: "Coaster",
      seat_capacity: 25,
      vehicle_status: "active",
    };

    const result = vehicleSchema.safeParse(vehicle);

    if (!result.success) {
    console.log(result.error.issues);
    }

    expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true);
  });
});