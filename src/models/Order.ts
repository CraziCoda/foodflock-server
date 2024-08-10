import mongoose from "mongoose";

export interface OrderI {
	userId: mongoose.Types.ObjectId;
	businessId: mongoose.Types.ObjectId;
	status: "pending" | "completed" | "cancelled";
	orderType: "delivery" | "pickup";
	deliveryAddress: string;
	deliveryCharge: number;
	acceptedByVendor: Boolean;
	markedAsCompleted: boolean;
	rating: number | null;
}

export interface OrderedMeaI {
	order: mongoose.Types.ObjectId;
	quantity: number;
	price: number;
	meal: mongoose.Types.ObjectId;
}

export interface OrderedAccompanimentI {
	order: mongoose.Types.ObjectId;
	quantity: number;
	price: number;
	accompaniment: mongoose.Types.ObjectId;
}

const OrderSchema = new mongoose.Schema<OrderI>({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	businessId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Business",
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "completed", "cancelled"],
		default: "pending",
	},
	orderType: {
		type: String,
		enum: ["delivery", "pickup"],
		required: true,
	},
	deliveryAddress: {
		type: String,
		default: "",
	},
	deliveryCharge: {
		type: Number,
		required: true,
		default: 0,
	},
	acceptedByVendor: {
		type: Boolean,
		required: true,
		default: false,
	},
	markedAsCompleted: {
		type: Boolean,
		required: true,
		default: false,
	},
	rating: {
		type: Number,
		required: true,
		default: null,
		min: 0,
		max: 5,
	},
});

const OrderedMealSchema = new mongoose.Schema<OrderedMeaI>({
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 1,
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	meal: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Meal",
		required: true,
	},
});

const OrderedAccompanimentSchema = new mongoose.Schema<OrderedAccompanimentI>({
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 1,
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	accompaniment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Accompaniment",
		required: true,
	},
});

const Order = mongoose.model("Order", OrderSchema);
const OrderedMeal = mongoose.model("OrderedMeal", OrderedMealSchema);
const OrderedAccompaniment = mongoose.model(
	"OrderedAccompaniment",
	OrderedAccompanimentSchema
);

export { Order, OrderedMeal, OrderedAccompaniment };
