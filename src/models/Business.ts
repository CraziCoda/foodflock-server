import mongoose from "mongoose";

export interface BusinessI extends mongoose.Document {
	name: string;
	email: string;
	owner: mongoose.Types.ObjectId;
	phone: string;
	description: string;
	makes_delivery: boolean;
    location: string;
}

const BusinessSchema = new mongoose.Schema<BusinessI>({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	makes_delivery: {
		type: Boolean,
		required: true,
		default: false,
	},
    location: {
        type: String,
        required: true,
    }
});

export default mongoose.model<BusinessI>("Business", BusinessSchema);

export interface FavouriteI extends mongoose.Document {
	business: mongoose.Types.ObjectId;
	user: mongoose.Types.ObjectId;
}

const FavouriteSchema = new mongoose.Schema<FavouriteI>({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	business: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Business",
		required: true,
	},
});

export const Favourite =  mongoose.model<FavouriteI>("Favourite", FavouriteSchema);