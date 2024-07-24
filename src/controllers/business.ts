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
	const makes_delivery = updates.makes_delivery?.toLowerCase() === "yes";
	try {
		await Business.findOneAndUpdate(
			{ owner: user?._id },
			{ $set: { ...updates, makes_delivery } }
		);
		return res.status(200).json({ message: "Business updated" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Couldn't update business" });
	}
};
