import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import { PORT } from "./config";
import allRouter from "./routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

export const app = express();

app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.all("/api/v1/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", allRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
