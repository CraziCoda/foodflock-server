import { Request, Response } from "express";
import Business from "../models/Business";
import { Accompaniment, Meal } from "../models/Meal";

const addMeal = async (req: Request, res: Response) => {
	const { name, price, meal_type, description, charge_type, accompaniments } =
		req.body;

	if (!name || !price || !meal_type || !description || !charge_type) {
		return res.status(400).json({ message: "All fields are required" });
	}

	if (charge_type !== "price" && charge_type !== "quantity") {
		return res.status(400).json({ message: "Invalid charge type" });
	}

	if (
		meal_type !== "breakfast" &&
		meal_type !== "lunch" &&
		meal_type !== "dinner" &&
		meal_type !== "snack" &&
		meal_type !== "all"
	) {
		return res.status(400).json({ message: "Invalid meal type" });
	}

	try {
		const business = await Business.findOne({ owner: req.user?._id });
		if (!business)
			return res.status(404).json({ message: "Business not found" });

		const meal = await Meal.create({
			name,
			price,
			meal_type,
			description,
			charge_type,
			business: business._id,
		});

		for (const accompaniment of accompaniments) {
			const { name, price, isFree } = accompaniment;

			await Accompaniment.create({
				name,
				price,
				isFree,
				meal: meal._id,
			});
		}

		return res.status(200).json({ message: "Meal created", meal });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Couldn't add meal" });
	}
};
const updateMeal = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { updates } = req.body;

	try {
		await Meal.findByIdAndUpdate(id, { $set: { ...updates } });
		return res.status(200).json({ message: "Meal updated" });
	} catch (error) {}
};
const deleteMeal = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await Meal.findByIdAndDelete(id);
		return res.status(200).json({ message: "Meal deleted" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Couldn't delete meal" });
	}
};

export { addMeal, updateMeal, deleteMeal };
