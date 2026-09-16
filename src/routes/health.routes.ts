import {Router} from "express"
import { validate } from "../middlewares/validate.middleware.js";
import { vehicleSchema } from "../schemas/vehicle.schema.js"


const router =Router();

router.get("/health",(req, res)=>{
    res.status(200).json({
        success : true,
        message : "Server is healthy"
    });
});

router.post("/vehicle",
    validate(vehicleSchema),
    (req, res)=>{
    res.status(201).json({
        success : true,
        message : "vehicle data is valid"
    })
})

export default router;