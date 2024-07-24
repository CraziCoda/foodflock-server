import { Router } from "express";
import { isAuthenticatedVendor } from "../functions/isAuthenticated";
import { getBusiness, updateBusiness } from "../controllers/business";

const router = Router();

router.get("/", isAuthenticatedVendor, getBusiness);
router.put("/", isAuthenticatedVendor, updateBusiness);

export default router;