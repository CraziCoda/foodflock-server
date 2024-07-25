import { Router } from "express";
import auth from "./auth";
import business from "./business";
import meal from "./meal";
import order from "./order";

const router = Router();

router.use("/auth", auth);
router.use("/business", business);
router.use("/meals", meal);
router.use("/order", order);

export default router;
