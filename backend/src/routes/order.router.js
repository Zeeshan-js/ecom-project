import { Router } from "express";
import { createOrder, getOrderStatus } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

    router.use(verifyJWT)

    router.route("/make").post(createOrder)

    router.route("/:orderId/status", getOrderStatus)

export default router