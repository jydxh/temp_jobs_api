const express = require("express");

const router = express.Router();
const {
	createJob,
	deleteJob,
	getAlljobs,
	getJob,
	updateJob,
} = require("../controllers/jobs");

router.route("/").post(createJob).get(getAlljobs);
router.route("/:id").patch(updateJob).delete(deleteJob).get(getJob);

module.exports = router;
