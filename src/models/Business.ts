import mongoose from "mongoose";

export interface BusinessI extends mongoose.Document {
	name: string;
	email: string;
	owner: mongoose.Types.ObjectId;
	phone: string;
	description: string;
	makes_delivery: boolean;
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
});

export default mongoose.model<BusinessI>("Business", BusinessSchema);
