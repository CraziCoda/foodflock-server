import { Router } from "express";
import {
	isAuthenticated,
	isAuthenticatedVendor,
} from "../functions/isAuthenticated";
import {
	acceptOrder,
	cancelOrder,
	getOrders,
	placeOrder,
} from "../controllers/order";

const router = Router();

router.post("/", isAuthenticated, placeOrder);
router.get("/", isAuthenticated, getOrders);
router.put("/accept/:id", isAuthenticatedVendor, acceptOrder);
router.put("/cancel/:id", isAuthenticated, cancelOrder);

export default router;
