import type { Request, Response } from "express";

export const createVehicle = (req : Request , res : Response) =>{
    res.status(201).json({
        success : true,
        message : "vehicle data is valid"
    });
};