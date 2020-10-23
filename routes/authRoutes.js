const express = require("express");
const passport = require("passport");

const router = express.Router();

router.post("/login", async (req, res) => {
	passport.authenticate("local", {
		successRedirect: "/success",
		failureRedirect: "/create_account",
		failureFlash: true,
	});
});

router.post("/success", async (req, res) => {
	console.log("/success route");
	res.send("success");
});

module.exports = router;
