//const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong, please try again later",
	};
	// if (err instanceof CustomAPIError) {
	// 	return res.status(err.statusCode).json({ msg: err.message });
	// }
	if (err.code && err.code === 11000) {
		customError.statusCode = StatusCodes.NOT_FOUND;
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)}, please try another value`;
	}
	// validatdor errors
	if (err.name === "ValidationError") {
		customError.statusCode = StatusCodes.BAD_REQUEST;
		customError.msg = `User validation failed, please provide ${Object.keys(
			err.errors
		).join(",")}`;
	}
	// casting errors from mongoose,
	// (if userId OR the jobId formate not macth the mongoose formate, then the cast error will return), this to not user friendly
	if (err.name === "CastError") {
		customError.statusCode = StatusCodes.NOT_FOUND;
		customError.msg = `cannot find the item with the id: ${err.value}`;
	}
	//return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
	return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
