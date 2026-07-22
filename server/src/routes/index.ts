import { Router } from "express";

import authRouter from "@/routes/auth.routes";

const allRouter = Router();
            
allRouter.use("/auth", authRouter);

export default allRouter;
