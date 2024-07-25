import { Request, Response } from "express";
import { Accompaniment, Meal, MealI } from "../models/Meal";
import { Order, OrderedAccompaniment, OrderedMeal } from "../models/Order";
import Business from "../models/Business";

export const placeOrder = async (req: Request, res: Response) => {
	const user = req.user;
	const { charge_type, meal_id, quantity, amount, accompaniments } = req.body;

	console.log(quantity);

	try {
		const meal = await Meal.findById(meal_id);

		if (!meal) return res.status(404).json({ message: "Meal not found" });
		let price = 0;
		if (charge_type == "price") {
			price = amount;
		} else {
			price = amount;
		}

		const order = await Order.create({
			userId: user._id,
			businessId: meal.business,
			status: "pending",
			orderType: "pickup",
		});

		const orderMeal = await OrderedMeal.create({
			order: order._id,
			meal: meal._id,
			quantity: quantity,
			price: price,
		});

		for (let accompaniment of accompaniments) {
			const acc = await Accompaniment.findById(accompaniment);

			if (!acc) continue;

			await OrderedAccompaniment.create({
				order: order._id,
				accompaniment: acc._id,
				quantity: 1,
				price: acc.price,
			});
		}
		const order_arr = [];
		const orders = await Order.find({ userId: user._id }, "-___v");

		for (let order of orders) {
			const order_obj = {
				_id: order._id,
				status: order.status,
				orderType: order.orderType,
				deliveryAddress: order.deliveryAddress,
				deliveryCharge: order.deliveryCharge,
				markedAsCompleted: order.markedAsCompleted,
			};

			const meal = await OrderedMeal.findOne({ order: order._id });
			// @ts-ignore
			order_obj.meal = meal;

			const accompaniments = await OrderedAccompaniment.find({
				order: order._id,
			});
			// @ts-ignore
			order_obj.accompaniments = accompaniments;

			order_arr.push(order_obj);
		}

		return res
			.status(200)
			.json({ message: "Order placed successfully", orders: order_arr });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Couldn't place order" });
	}
};

export const getOrders = async (req: Request, res: Response) => {
	const user = req.user;
	try {
		if (user.role === "client") {
			const order_arr = [];
			const orders = await Order.find({ userId: user._id }, "-___v");

			for (let order of orders) {
				const business = await Business.findById(order.businessId);
				if (!business) continue;

				const order_obj = {
					businessName: business.name,
					_id: order._id,
					status: order.status,
					orderType: order.orderType,
					deliveryAddress: order.deliveryAddress,
					deliveryCharge: order.deliveryCharge,
					markedAsCompleted: order.markedAsCompleted,
					acceptedByVendor: order.acceptedByVendor,
				};

				const meal = await OrderedMeal.findOne({ order: order._id });
				const { name } = (await Meal.findById(meal?.meal, "name")) || {
					name: "",
				};
				// @ts-ignore
				order_obj.meal = meal;
				// @ts-ignore
				order_obj.meal_name = name;

				const accompaniments = await OrderedAccompaniment.find({
					order: order._id,
				});
				// @ts-ignore
				order_obj.accompaniments = accompaniments;

				order_arr.push(order_obj);
			}

			return res.status(200).json({ orders: order_arr });
		} else {
			const business = await Business.findOne({ owner: user._id });

			if (!business)
				return res.status(401).json({ message: "No business found" });

			const order_arr = [];
			const orders = await Order.find({ businessId: business._id }, "-___v");

			for (let order of orders) {
				const order_obj = {
					businessName: business.name,
					_id: order._id,
					status: order.status,
					orderType: order.orderType,
					deliveryAddress: order.deliveryAddress,
					deliveryCharge: order.deliveryCharge,
					markedAsCompleted: order.markedAsCompleted,
					acceptedByVendor: order.acceptedByVendor,
				};

				const meal = await OrderedMeal.findOne({ order: order._id });
				const { name } = (await Meal.findById(meal?.meal, "name")) || {
					name: "",
				};
				// @ts-ignore
				order_obj.meal = meal;
				// @ts-ignore
				order_obj.meal_name = name;

				const accompaniments = await OrderedAccompaniment.find({
					order: order._id,
				});
				// @ts-ignore
				order_obj.accompaniments = accompaniments;

				order_arr.push(order_obj);
			}

			return res.status(200).json({ orders: order_arr });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Couldn't get orders" });
	}
};

export const acceptOrder = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await Order.updateOne({ _id: id }, { $set: { acceptedByVendor: true } });

		return res.status(200).json({ message: "Order accepted successfully" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Couldn't accept order" });
	}
};
export const cancelOrder = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await Order.updateOne({ _id: id }, { $set: { status: "cancelled" } });

		return res.status(200).json({ message: "Order cancelled successfully" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Couldn't accept order" });
	}
};
