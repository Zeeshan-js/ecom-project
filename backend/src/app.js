import express from "express";
import cors from "cors";
import { createServer } from "http";
import orderRouter from "./routes/order.router.js"
import cartRouter from "./routes/cart.router.js"
import userRouter from "./routes/user.router.js"
import productRouter from "./routes/product.router.js"
import cookieParser from "cookie-parser"

const app = express();

const httpServer = createServer(app);

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser())
app.use(express.urlencoded({ limit: "16kb", extended: true }));

app.use("/api/v1/user", userRouter)
app.use("/api/v1/product", productRouter)
app.use("/api/v1/order", orderRouter)
app.use("/api/v1/cart", cartRouter)

export { httpServer };
