import mongoose from "mongoose";

export interface UserI {
	_id: mongoose.Schema.Types.ObjectId;
	name: string;
	email: string;
	password: string;
	role: "buyer" | "seller" | "admin" | null;
}

const UserSchema = new mongoose.Schema<UserI>(
	{
		name: {
			type: String,
			default: "",
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
            lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: null,
			enum: ["buyer", "seller", "admin", null],
			lowercase: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<UserI>("User", UserSchema);
