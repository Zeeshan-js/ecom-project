import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { httpServer } from "./app.js";

dotenv.config({
    path: "./.env"
})

connectDB();

const server = httpServer.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on", process.env.PORT || 3000)
})