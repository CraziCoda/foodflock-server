import { Router } from "express";
import { isAuthenticated, isAuthenticatedVendor } from "../functions/isAuthenticated";
import {
	getBusiness,
	updateBusiness,
	getAllBusiness,
    setFavourite,
} from "../controllers/business";

const router = Router();

router.get("/", isAuthenticatedVendor, getBusiness);
router.get("/all", isAuthenticated, getAllBusiness);
router.post("/fav", isAuthenticated, setFavourite);
router.put("/", isAuthenticatedVendor, updateBusiness);

export default router;
