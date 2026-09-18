import { prisma } from "../config/prisma.js";

export const createVehicle = async( data : {
    vehicle_type : "AC" | "Non-AC";
    vehicle_manufactured_year:number;
    vehicle_manufacturer: string;
    vehicle_model: string;
    seat_capacity:number;
    vehicle_status: "active" | "retired" | "under_maintainance";

}) =>{
    return prisma.vehicle.create({
        data
    });
};