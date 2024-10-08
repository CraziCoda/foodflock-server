import express from "express";
import cors from "cors";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

require("./service/db");

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

app.use("/", routes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
