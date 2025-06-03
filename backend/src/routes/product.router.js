import { Router } from "express";
import { createProduct, getAllProduct, getProductById } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../utils/mongodbValidator.js";

const router = Router();

router.use(verifyJWT)

router.route("/").get(getAllProduct)

router.route("/:productId").get(mongoIdPathVariableValidator("productId"), getProductById)

router.route("/upload").post(
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  createProduct
);
export default router;
