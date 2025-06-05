import { Router } from "express";
import { createOrder, getOrderStatus } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

    router.use(verifyJWT)

    router.route("/make/:productId").post(createOrder)

    router.route("/thank-you/:orderId").get(getOrderStatus)

    router.route("/:orderId/status").get(getOrderStatus)

export default router