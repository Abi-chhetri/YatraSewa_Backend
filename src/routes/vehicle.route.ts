import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { vehicleSchema } from "../schemas/vehicle.schema.js";
import { createVehicle } from "../controllers/vehicle.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/vehicle:
 *   post:
 *     summary: Create a new vehicle
 *     tags:
 *       - Vehicle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_id
 *               - vehicle_type
 *               - vehicle_manufactured_year
 *               - vehicle_manufacturer
 *               - vehicle_model
 *               - seat_capacity
 *               - vehicle_status
 *             properties:
 *               vehicle_id:
 *                 type: integer
 *               vehicle_type:
 *                 type: string
 *                 enum: [AC, Non-AC]
 *               vehicle_manufactured_year:
 *                 type: integer
 *               vehicle_manufacturer:
 *                 type: string
 *               vehicle_model:
 *                 type: string
 *               seat_capacity:
 *                 type: integer
 *               vehicle_status:
 *                 type: string
 *                 enum: [active, retired, under_maintainance]
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 */
router.post("/vehicle",
    validate(vehicleSchema),
    createVehicle
);

export default router;