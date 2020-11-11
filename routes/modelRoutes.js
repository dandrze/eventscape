const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/api/model", async (req, res) => {
	const modelId = req.query.id;
	console.log(modelId);
	const sectionList = await db.query(
		"SELECT * FROM section_html WHERE model=$1 ORDER BY index ASC",
		[modelId],
		(err, res) => {
			if (err) {
				throw res.status(500).send(err);
			}
		}
	);

	res.send(sectionList.rows);
});

router.put("/api/model", async (req, res) => {
	const { model } = req.body;

	// first delete the old model
	await db.query("DELETE FROM section_html WHERE model=$1", [model[0].model]);

	// then write the newly updated model
	for (const section of model) {
		await db.query(
			"INSERT INTO section_html (model, index, html) VALUES ($1,$2,$3)",
			[section.model, section.index, section.html],
			(err, res) => {
				if (err) {
					throw res.status(500).send(err);
				}
			}
		);
	}

	res.status(200).send();
});

router.get("/api/page", async (req, res) => {
	const link = req.query.link;
	console.log(link);

	const model = await db.query(
		"SELECT reg_page_model FROM event WHERE link=$1",
		[link],
		(err, res) => {
			if (err) {
				throw res.status(500).send(err);
			}
		}
	);

	if (model.rowCount == 0) {
		res.send([]);
	} else {
		const sectionList = await db.query(
			"SELECT * FROM section_html WHERE model=$1 ORDER BY index ASC",
			[model.rows[0].reg_page_model],
			(err, res) => {
				if (err) {
					throw res.status(500).send(err);
				}
			}
		);

		res.status(200).send(sectionList.rows);
	}
});

module.exports = router;
