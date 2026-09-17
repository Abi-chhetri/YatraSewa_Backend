import {Router} from "express"

const router =Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get("/health",(req, res)=>{
    res.status(200).json({
        success : true,
        message : "Server is healthy"
    });
});

export default router;