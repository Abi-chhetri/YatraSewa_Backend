import express from "express";
import healthRouter from "./routes/health.routes.js"; //while importing can give any name 
import logger from "./middlewares/logger.middleware.js";
import cors from "cors"
import helmet from "helmet"
import { apiRateLimiter } from "./middlewares/rate-limit.middleware.js";
import errorMiddlWare from "./middlewares/error.middleware.js";

const app=express();
//middlewares
    // cors({
    // origin: "https://www.yatrasewa.com"
    // })
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(logger);

//rate limiter comes before api gateway/route
app.use(apiRateLimiter); //api gate keeper 1 client = 100 request/15 min

//routing 
app.use("/api/v1",healthRouter);

//error handler
app.use(errorMiddlWare);


export default app;