import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { httpServer } from "./app.js";

dotenv.config({
    path: "./.env"
})

connectDB();

const port = process.env.PORT || 3000

const server = httpServer.listen(port, () => {
    console.log("Server is listening on", port)
})