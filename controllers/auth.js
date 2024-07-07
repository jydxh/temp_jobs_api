const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = user.genToken();
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError("email and password cannot be empty!");
	}
	const user = await User.findOne({ email });

	if (!user) {
		throw new UnauthenticatedError("invalid Credentials");
	}
	// compare password
	const isMatch = await user.comparePwd(password);
	if (!isMatch) {
		throw new UnauthenticatedError("invalid password!");
	}

	const token = user.genToken();
	res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
