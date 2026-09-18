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
 *               - vehicle_type
 *               - vehicle_manufactured_year
 *               - vehicle_manufacturer
 *               - vehicle_model
 *               - seat_capacity
 *               - vehicle_status
 *             properties:
 *               vehicle_type:
 *                 type: string
 *                 enum:
 *                   - AC
 *                   - Non-AC
 *                 example: AC
 *               vehicle_manufactured_year:
 *                 type: integer
 *                 example: 2024
 *               vehicle_manufacturer:
 *                 type: string
 *                 example: Toyota
 *               vehicle_model:
 *                 type: string
 *                 example: Coaster
 *               seat_capacity:
 *                 type: integer
 *                 example: 25
 *               vehicle_status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - retired
 *                   - under_maintainance
 *                 example: active
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Vehicle created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicle_id:
 *                       type: string
 *                       format: uuid
 *                       example: 79a9bbc6-42cd-455d-9e6a-c08f2f500372
 *                     vehicle_type:
 *                       type: string
 *                       example: AC
 *                     vehicle_manufactured_year:
 *                       type: integer
 *                       example: 2024
 *                     vehicle_manufacturer:
 *                       type: string
 *                       example: Toyota
 *                     vehicle_model:
 *                       type: string
 *                       example: Coaster
 *                     seat_capacity:
 *                       type: integer
 *                       example: 25
 *                     vehicle_status:
 *                       type: string
 *                       example: active
 */
router.post("/vehicle",
    validate(vehicleSchema),
    createVehicle
);

export default router;