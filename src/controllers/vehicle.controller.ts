import type { Request, Response } from "express";
import { createVehicle as createVehicleService } from "../services/vehicle.service.js";

export const createVehicle = async (req: Request, res: Response) => {
  const vehicle = await createVehicleService(req.body);

  res.status(201).json({
    success: true,
    message: "vehicle created successfully",
    data: vehicle,
  });
};