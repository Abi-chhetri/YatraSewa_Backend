import type { Request, Response, NextFunction } from "express";
import { send } from "process";

const errorMiddlWare= (
    err : Error,
    req : Request,
    res : Response,
    next : NextFunction
) => {
    console.error(err);

    res.status(500).json({
        success : false,
        message : "Internal Server Error",
    });
};

export default errorMiddlWare;