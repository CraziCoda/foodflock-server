import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserI } from "../models/User";

export const isAuthenticated = (
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
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

export const isAuthenticatedVendor = (
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
		if (user.role !== "vendor") {
			return res.status(401).json({ message: "Unauthorized" });
		}
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};
