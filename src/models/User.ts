import mongoose from "mongoose";

interface UserI {
	name: string;
	email: string;
	password: string;
	role: string;
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
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
            default: "buyer",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<UserI>("User", UserSchema);
