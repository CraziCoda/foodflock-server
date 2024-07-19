import mongoose from "mongoose";

export interface MealI {
	name: string;
	starting_price: number;
	meal_type: "breakfast" | "lunch" | "dinner" | "snack" | "all";
	description: string;
    charge_type: "price" | "quantity"
}

export interface AccompanimentI {
	name: string;
	meal: mongoose.Types.ObjectId;
	starting_price: number;
	isFree: boolean;
}

const MealSchema = new mongoose.Schema<MealI>({
	name: {
		type: String,
		required: true,
	},
	starting_price: {
		type: Number,
		required: true,
		default: 0,
	},
	meal_type: {
		type: String,
		enum: ["breakfast", "lunch", "dinner", "snack", "all"],
		required: true,
		default: "all",
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
    }
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
	starting_price: {
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
export const Accompaniment = mongoose.model("Accompaniment", AccompanimentSchema);
