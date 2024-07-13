import { Router } from "express";
import { register, selectRole } from "../controllers/auth";
import { isAuthenticated } from "../functions/isAuthenticated";

const router = Router();

router.post("/register", register);
router.post("/register/role", isAuthenticated, selectRole);

export default router;
