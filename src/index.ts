import express from "express";
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("Hello, There");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
