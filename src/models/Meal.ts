import mongoose from "mongoose";

export interface MealI {
	name: string;
	price: number;
	quantity: number;
	meal_type: "breakfast" | "lunch" | "dinner" | "snack" | "other";
	description: string;
	charge_type: "price" | "quantity";
	business: mongoose.Types.ObjectId;
}

export interface AccompanimentI {
	name: string;
	meal: mongoose.Types.ObjectId;
	price: number;
	isFree: boolean;
}

const MealSchema = new mongoose.Schema<MealI>({
	name: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 0,
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	meal_type: {
		type: String,
		enum: ["breakfast", "lunch", "dinner", "snack", "other"],
		required: true,
		default: "other",
	},
	description: {
		type: String,
		default: "",
	},
	charge_type: {
		type: String,
		enum: ["price", "quantity"],
		required: true,
		default: "price",
	},
	business: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Business",
		required: true,
	},
});

const AccompanimentSchema = new mongoose.Schema<AccompanimentI>({
	name: {
		type: String,
		required: true,
	},
	meal: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Meal",
		required: true,
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	isFree: {
		type: Boolean,
		required: true,
		default: false,
	},
});

export const Meal = mongoose.model("Meal", MealSchema);
export const Accompaniment = mongoose.model(
	"Accompaniment",
	AccompanimentSchema
);
