import { Router } from "express"
import { addItemsOrUpdateItemQuantity, getUserCart, removeItemFromCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route("/").get(getUserCart);

router.route("/items/:productId").post(addItemsOrUpdateItemQuantity)
    
router.route("/:productId").delete(removeItemFromCart)

export default router