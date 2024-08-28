import { Router } from "express";
import {
	addMeal,
	updateMeal,
	deleteMeal,
	getMeals,
	recommend_meal,
} from "../controllers/meal";
import {
	isAuthenticated,
	isAuthenticatedVendor,
} from "../functions/isAuthenticated";
import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			Date.now() + "_" + file.originalname.replace(/\s/g, "_").toLowerCase()
		);
	},
});
const upload = multer({ storage: storage });

const router = Router();

router.post("/", isAuthenticatedVendor, upload.single("image"), addMeal);
router.delete("/:id", isAuthenticatedVendor, deleteMeal);
router.put("/:id", isAuthenticatedVendor, upload.single("image"), updateMeal);
router.get("/", isAuthenticated, getMeals);
router.get("/recommended", isAuthenticated, recommend_meal);

export default router;
