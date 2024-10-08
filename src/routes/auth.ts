import { Router } from "express";
import { register, selectRole, addBusiness, login } from "../controllers/auth";
import { isAuthenticated } from "../functions/isAuthenticated";

const router = Router();

router.post("/register", register);
router.post("/register/role", isAuthenticated, selectRole);
router.post("/register/business", isAuthenticated, addBusiness);

router.post("/login", login);

export default router;
