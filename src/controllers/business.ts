import { Request, Response } from "express";
import Business from "../models/Business";

export const getBusiness = async (req: Request, res: Response) => {
	const user = req.user;
	try {
		const business = await Business.findOne({ owner: user?._id }, "-__v");

		if (!business)
			return res.status(404).json({ message: "Business not found" });

		return res.status(200).json({ business });
	} catch (error) {
		return res.status(500).json({ message: "Couldn't get business" });
	}
};

export const updateBusiness = async (req: Request, res: Response) => {
	const user = req.user;
	const { updates } = req.body;
	try {
		await Business.findOneAndUpdate(
			{ owner: user?._id },
			{ $set: { ...updates } }
		);
		return res.status(200).json({ message: "Business updated" });
	} catch (error) {
		return res.status(500).json({ message: "Couldn't update business" });
	}
};
