import express from "express";
import cors from "cors"
import routes from "./routes/index";
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

require("./service/db");

app.use(express.json());
app.use(cors());

app.use("/", routes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
