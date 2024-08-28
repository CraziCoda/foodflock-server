import { Request, Response } from "express";
import Business, { Favourite } from "../models/Business";
import { Order, OrderedMeal } from "../models/Order";
import mongoose from "mongoose";

export const getBusiness = async (req: Request, res: Response) => {
	const user = req.user;
	try {
		const business = await Business.findOne({ owner: user?._id }, "-__v");

		if (!business)
			return res.status(404).json({ message: "Business not found" });

		const data = await analytics(business._id as mongoose.Types.ObjectId);

		const business_obj = {
			...business.toObject(),
			analytics: data,
		};

		return res.status(200).json({ business: business_obj });
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
		const businesses = await Business.find({}, "-__v", {
			sort: {
				createdAt: -1,
			},
		});
		const businesses_arr: any = [];

		await Promise.all(
			businesses.map(async (business) => {
				const orders = await Order.find({ businessId: business._id });
				const favourites = await Favourite.find({ business: business._id });
				const isFavourite =
					(await Favourite.findOne({
						business: business._id,
						user: req.user._id,
					})) !== null;

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
					favourites: favourites?.length || 0,
					isFavourite,
				});
			})
		);
		return res.status(200).json({ businesses: businesses_arr });
	} catch (error) {
		return res.status(500).json({ message: "Couldn't get businesses" });
	}
};

export const setFavourite = async (req: Request, res: Response) => {
	const business = req.body.business;

	try {
		const isFavourite = await Favourite.findOne({
			business,
			user: req.user._id,
		});

		if (isFavourite) {
			await Favourite.deleteOne({ business, user: req.user._id });
		} else {
			await Favourite.create({
				business,
				user: req.user._id,
			});
		}

		return res.status(200).json({ message: "Successful" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

const analytics = async (business_id: mongoose.Types.ObjectId) => {
	const completed_orders = await Order.find({
		businessId: business_id,
		status: "completed",
		markedAsCompleted: true,
	}).countDocuments();

	const pending_orders = await Order.find({
		businessId: business_id,
		status: "pending",
	}).countDocuments();

	const cancelled_orders = await Order.find({
		businessId: business_id,
		status: "cancelled",
	}).countDocuments();

	const total_orders = await Order.find({
		businessId: business_id,
	}).countDocuments();

	const orders = await Order.find({ businessId: business_id });

	let total_revenue = 0;
	let potential_revenue = 0;
	let stars = {
		"4_5": 0,
		"3": 0,
		"2": 0,
		"1": 0,
	};
	let average_rating = 0;
	let no_rating = 0;

	for (const order of orders) {
		if (order.status === "completed") {
			const ordered_meal = await OrderedMeal.findOne({ order: order._id });
			total_revenue +=
				(ordered_meal?.price || 0) * (ordered_meal?.quantity || 1);
		}
		if (order.status === "pending") {
			const ordered_meal = await OrderedMeal.findOne({ order: order._id });
			potential_revenue +=
				(ordered_meal?.price || 0) * (ordered_meal?.quantity || 1);
		}

		if (order.rating) {
			if (order.rating >= 4) {
				stars["4_5"]++;
			} else if (order.rating >= 3) {
				stars["3"]++;
			} else if (order.rating >= 2) {
				stars["2"]++;
			} else if (order.rating >= 1) {
				stars["1"]++;
			}

			average_rating += order.rating;
			no_rating++;
		}
	}

	average_rating /= no_rating;

	return {
		completed_orders,
		pending_orders,
		cancelled_orders,
		total_orders,
		total_revenue,
		potential_revenue,
		stars,
		average_rating,
	};
};
