import { afterAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { prisma } from "../src/config/prisma.js";
import app from "../src/app.js";

describe("Vehicle Creation Integration", () => {
  let vehicleId: string;

  afterAll(async () => {
    if (vehicleId) {
      await prisma.vehicle.delete({
        where: {
          vehicle_id: vehicleId,
        },
      });
    }

    await prisma.$disconnect();
  });

  it("should create a vehicle in the database", 
    async () => {
    const response = await request(app)
      .post("/api/v1/vehicle")
      .send({
        vehicle_type: "AC",
        vehicle_manufactured_year: 2024,
        vehicle_manufacturer: "Toyota",
        vehicle_model: "Coaster",
        seat_capacity: 25,
        vehicle_status: "active",
      });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.vehicle_id).toEqual(
      expect.any(String)
    );

    vehicleId = response.body.data.vehicle_id;

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        vehicle_id: vehicleId,
      },
    });

    expect(vehicle).not.toBeNull();

    expect(vehicle).toMatchObject({
      vehicle_id: vehicleId,
      vehicle_type: "AC",
      vehicle_manufactured_year: 2024,
      vehicle_manufacturer: "Toyota",
      vehicle_model: "Coaster",
      seat_capacity: 25,
      vehicle_status: "active",
    });
  },
  25000
);
});

