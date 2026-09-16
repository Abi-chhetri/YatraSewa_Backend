import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Vehicle Validation", () => {
  it("should accept valid vehicle data", async () => {
    const response = await request(app)
      .post("/api/v1/vehicle")
      .send({
        vehicle_id: 1,
        vehicle_type: "AC",
        vehicle_manufactured_year: 2024,
        vehicle_manufacturer: "Toyota",
        vehicle_model: "Coaster",
        seat_capacity: 25,
        vehicle_status: "active",
      });

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      success: true,
      message: "vehicle data is valid",
    });
  });
});