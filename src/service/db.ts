import mongoose from "mongoose";

const db_uri = process.env.MONGO_SERVER || "";

mongoose
	.connect(db_uri)
	.then(() => {
		console.log("Mongo Server connected");
	})
	.catch((err) => {
		console.log(`Failed to connect: ${err}`);
	});