import { Request, Response } from "express";
import User from "../models/User";
import brycpt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	if (
		name === "" ||
		email === "" ||
		password === "" ||
		!name ||
		!email ||
		!password
	) {
		return res.status(400).json({ message: "Email and password are required" });
	}

	if (password.length < 6) {
		return res.status(400).json({ message: "Password less than 6 characters" });
	}

	try {
		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await brycpt.hash(password, 12);

		const new_user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		const maxAge = 3 * 60 * 60;
		const token = jwt.sign(
			{ name: new_user.name, email: new_user.email, _id: new_user._id },
			process.env.JWT_SECRET!,
			{ expiresIn: maxAge }
		);

		res.cookie("jwt", token, {
			httpOnly: true,
			maxAge: maxAge * 1000,
		});

		return res.status(201).json({ message: "User created" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Couldn't register user" });
	}
};

export { register };
