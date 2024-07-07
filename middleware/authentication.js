const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
	//check header
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthenticatedError("please provide a toten!");
	}
	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET); // rememeber: JWT is a encrypted string that contains user info, and we can use the verify method to de-code it and read the info at backedn; If the token is valid, jwt.verify returns the decoded payload; if not, it throws an error.
		// attch the user to the job routes
		req.user = { userId: payload.userId, name: payload.name };
		next();
	} catch (err) {
		throw new UnauthenticatedError("Unauthorized token!");
	}
};

module.exports = auth;
