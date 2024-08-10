import { Request, Response } from "express";
import Business from "../models/Business";
import { Order } from "../models/Order";

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

export const getAllBusiness = async (req: Request, res: Response) => {
	try {
		const businesses = await Business.find({}, "-__v");
		const businesses_arr: any = [];

		await Promise.all(
			businesses.map(async (business) => {
				const orders = await Order.find({ businessId: business._id });

				let total_rating = 0;
				let total_count = 0;

				for (const order of orders) {
					if (!order.rating) continue;
					total_rating += order.rating;
					total_count++;
				}

				let avg_rating = total_count > 0 ? total_rating / total_count : 0;
				avg_rating = Math.round(avg_rating * 100) / 100;

				businesses_arr.push({
					...business.toObject(),
					rating: avg_rating,
				});
			})
		);
		return res.status(200).json({ businesses: businesses_arr });
	} catch (error) {
		return res.status(500).json({ message: "Couldn't get businesses" });
	}
};
