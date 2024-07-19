import { Router } from "express";
import { addMeal, updateMeal, deleteMeal } from "../controllers/meal";
import { isAuthenticatedVendor } from "../functions/isAuthenticated";

const router = Router();

router.post("/", isAuthenticatedVendor, addMeal);
router.delete("/:id", isAuthenticatedVendor, deleteMeal);
router.put("/:id", isAuthenticatedVendor, updateMeal);

export default router;
