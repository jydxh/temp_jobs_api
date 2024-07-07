const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAlljobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort(
		"-createdAt"
	);
	res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
	const job = await Job.findOne({
		createdBy: req.user.userId,
		_id: req.params.id,
	});
	if (!job) {
		throw new NotFoundError(`No job with id ${req.params.id}`);
	}
	console.log(job);
	res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body);
	res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
	const {
		params: { id: jobId },
		user: { userId },
		body: { company, position },
	} = req;
	//console.log(req.body);
	if (company === "" || position === "") {
		throw new BadRequestError("Please provide company and position!");
	}
	const job = await Job.findByIdAndUpdate(
		{ createdBy: userId, _id: jobId },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
	const {
		params: { id: jobId },
		user: { userId },
	} = req;
	const result = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId });
	if (!result) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ msg: "success!" });
};

module.exports = { getAlljobs, getJob, createJob, deleteJob, updateJob };
