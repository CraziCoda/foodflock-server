import { Request, Response } from "express";
import User from "../models/User";

const register = async (req: Request, res: Response) => {
	const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

	if (password.length < 6) {
		return res.status(400).json({ message: "Password less than 6 characters" });
	}

	try {
        await User.create({ email, password });

        return res.status(201).json({ message: "User created" });
	} catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Couldn't register user" });
    }

	res.send({ email, password });
};

export default { register };
