import express from "express";
import cors from "cors";
import { createServer } from "http";

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
app.use(express.urlencoded({ limit: "16kb", extended: true }));

export { httpServer };
