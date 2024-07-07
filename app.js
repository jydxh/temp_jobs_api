require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const authenticateUser = require("./middleware/authentication");

//connect Db
const connectDB = require("./db/connect");

// extra security packages

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

app.set("trust proxy", 1);
app.use(
	rateLimit({
		windowMs: 20 * 60 * 1000,
		limit: 100,
	})
);
app.use(helmet());
app.use(cors());
app.use(xss());
// json middleware
app.use(express.json());

//routers
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.use("/api/v1/auth", authRouter);

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// routes
app.get("/", (req, res) => {
	res.send("jobs api");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		console.log("connected to DB...");
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
