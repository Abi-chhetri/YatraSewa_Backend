import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { vehicleSchema } from "../schemas/vehicle.schema.js";
import { createVehicle } from "../controllers/vehicle.controller.js";

const router = Router();

router.post("/vehicle",
    validate(vehicleSchema),
    createVehicle
);

export default router;