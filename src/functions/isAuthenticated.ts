import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserI } from "../models/User";

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.cookies?.jwt) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const token = req.cookies.jwt;
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET as string) as UserI;
		const db_user = (await User.findById(user._id)) as UserI;
		if (!db_user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		req.user = db_user;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

export const isAuthenticatedVendor = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.cookies?.jwt) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const token = req.cookies.jwt;

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET as string) as UserI;

		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const db_user = await User.findById(user._id);

		if (db_user?.role !== "vendor") {
			return res.status(401).json({ message: "Unauthorized" });
		}
		req.user = db_user;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};
