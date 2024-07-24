import { Request, Response } from "express";
import Business from "../models/Business";
import { Accompaniment, Meal } from "../models/Meal";

const addMeal = async (req: Request, res: Response) => {
	const { name, price, meal_type, description, charge_type, accompaniments } =
		req.body;

	if (!req.file) return res.status(400).json({ message: "Image required" });

	const image_path = req.file.path;

	if (name === "" || price === 0 || description === "" || charge_type === "") {
		return res.status(400).json({ message: "All fields are required" });
	}

	if (
		charge_type.toLowerCase() !== "price" &&
		charge_type.toLowerCase() !== "quantity"
	) {
		return res.status(400).json({ message: "Invalid charge type" });
	}

	if (
		meal_type.toLowerCase() !== "breakfast" &&
		meal_type.toLowerCase() !== "lunch" &&
		meal_type.toLowerCase() !== "dinner" &&
		meal_type.toLowerCase() !== "snack" &&
		meal_type.toLowerCase() !== "all"
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
			image: image_path,
			business: business._id,
		});

		for (let accompaniment of JSON.parse(accompaniments)) {
			const { name, price, free } = accompaniment;

			console.log(name, price, free);

			await Accompaniment.create({
				name,
				price,
				isFree: free.toLowerCase() === "yes",
				meal: meal._id,
			});
		}

		const meals = await Meal.find({ business: business._id });

		const meals_arr = [];

		for (let meal of meals) {
			const meal_obj = {
				_id: meal._id,
				name: meal.name,
				price: meal.price,
				meal_type: meal.meal_type,
				description: meal.description,
				charge_type: meal.charge_type,
				image: meal.image,
				accompaniments: [] as any,
			};
			const accompaniments = await Accompaniment.find({ meal: meal._id });
			meal_obj.accompaniments = accompaniments;
			meals_arr.push(meal_obj);
		}

		return res.status(200).json({ message: "Meal added", meals: meals_arr });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Couldn't add meal" });
	}
};
const updateMeal = async (req: Request, res: Response) => {
	const { id } = req.params;
	const updates = req.body;

	if (req.file) {
		updates.image = req.file.path;
	} else {
		delete updates.image;
	}
	// console.log(req.body, req.file);

	const accs = JSON.parse(req.body.accompaniments);

	try {
		const user = req.user;
		const business = await Business.findOne({ owner: user?._id });
		if (!business)
			return res.status(404).json({ message: "Business not found" });

		await Meal.findOneAndUpdate(
			{
				_id: id,
				business: business._id,
			},
			{ $set: { ...updates } }
		);

		await Accompaniment.deleteMany({ meal: id });

		for (let accompaniment of accs) {
			await Accompaniment.create({ ...accompaniment, meal: id });
		}

		const meals = await Meal.find({ business: business._id });

		const meals_arr = [];

		for (let meal of meals) {
			const meal_obj = {
				_id: meal._id,
				name: meal.name,
				price: meal.price,
				meal_type: meal.meal_type,
				description: meal.description,
				charge_type: meal.charge_type,
				image: meal.image,
				accompaniments: [] as any,
			};
			const accompaniments = await Accompaniment.find({ meal: meal._id });
			meal_obj.accompaniments = accompaniments;
			meals_arr.push(meal_obj);
		}

		return res.status(200).json({ message: "Meal updated", meals: meals_arr });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Couldn't update meal" });
	}
};
const deleteMeal = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const user = req.user;
		const business = await Business.findOne({ owner: user?._id });
		if (!business)
			return res.status(404).json({ message: "Business not found" });

		const meal = await Meal.deleteOne({ _id: id, business: business._id });
		if (meal.deletedCount > 0) await Accompaniment.deleteMany({ meal: id });

		const meals = await Meal.find({ business: business._id });
		const meals_arr = [];

		for (let meal of meals) {
			const meal_obj = {
				_id: meal._id,
				name: meal.name,
				price: meal.price,
				meal_type: meal.meal_type,
				description: meal.description,
				charge_type: meal.charge_type,
				image: meal.image,
				accompaniments: [] as any,
			};
			const accompaniments = await Accompaniment.find({ meal: meal._id });
			meal_obj.accompaniments = accompaniments;
			meals_arr.push(meal_obj);
		}

		return res.status(200).json({ message: "Meal deleted", meals: meals_arr });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Couldn't delete meal" });
	}
};

const getMeals = async (req: Request, res: Response) => {
	const user = req.user;
	// console.log(user);
	try {
		if (user.role === "vendor") {
			const business = await Business.findOne({ owner: user._id });
			if (!business)
				return res.status(404).json({ message: "Business not found" });
			const meals = await Meal.find({ business: business._id });

			const meals_arr = [];

			for (let meal of meals) {
				const meal_obj = {
					_id: meal._id,
					name: meal.name,
					price: meal.price,
					meal_type: meal.meal_type,
					description: meal.description,
					charge_type: meal.charge_type,
					image: meal.image,
					accompaniments: [] as any,
				};
				const accompaniments = await Accompaniment.find({ meal: meal._id });
				meal_obj.accompaniments = accompaniments;
				meals_arr.push(meal_obj);
			}
			return res.status(200).json({ meals: meals_arr });
		} else {
			const meals = await Meal.find();
			return res.status(200).json({ meals });
		}
	} catch (error) {
		return res.status(500).json({ message: "Couldn't get meals" });
	}
};

export { addMeal, updateMeal, deleteMeal, getMeals };
