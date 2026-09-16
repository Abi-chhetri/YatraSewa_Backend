import rateLimit from "express-rate-limit";

export const apiRateLimiter=rateLimit({
    limit:100,
    windowMs: 15 * 60 * 1000, // 15 * 60 sec = 1min * 1000ms =1 sec total window is 100 request per 15 min
    standardHeaders: "draft-8",
    legacyHeaders: false
});