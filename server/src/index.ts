import express from "express";
import cookieParser from "cookie-parser";
import { passportAuthGoogle } from "./lib/google-auth";
import morgan from "morgan";
import cors from "cors";
import { PORT } from "./config";
import allRouter from "./routes";
import { normalLimiter } from "./middleware/rate-limit";

export const app = express();

app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(cookieParser());
app.use(passportAuthGoogle.initialize());

app.use("/api/v1", allRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
