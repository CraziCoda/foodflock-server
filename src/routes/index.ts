import { Router } from "express";
import auth from "../controllers/auth";

const router = Router();

router.use("/auth", auth.register);

export default router;
