const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const router = express.Router();

router.put("/api/account", async (req, res) => {
  const { userId, contactData } = req.body;
  const { first_name, last_name, email } = contactData;

  const updatedAccount = await db.query(
    "UPDATE account SET first_name=$1, last_name=$2, email=$3 WHERE id=$4 RETURNING first_name, last_name, email, id",
    [first_name, last_name, email, userId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send(updatedAccount.rows[0]);
});

router.post("/api/account", async (req, res) => {
  const { userData } = req.body;
  const { email, firstName, lastName, password } = userData;
  console.log(req.body);

  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  const newUser = await db.query(
    "INSERT INTO account (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [email, firstName, lastName, hashedPassword],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send(newUser.rows[0]);
});

router.get("/api/account/email", async (req, res) => {
  const { email } = req.query;

  const userData = await db.query(
    "SELECT * FROM account WHERE email=$1",
    [email],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );

  res.send(userData.rows[0]);
});

router.put("/api/account/pw", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  const existingUser = await db.query(
    "SELECT password from account where id=$1",
    [userId]
  );

  // if the password doesn't match, return an 401 unauthorized error
  const match = await bcrypt.compare(
    oldPassword,
    existingUser.rows[0].password
  );
  if (!match) {
    return res.status(401).send({ error: "Current password is not correct" });
  }

  // has the password so we don't store the plain text password in our database
  const hashedPassword = await bcrypt.hashSync(newPassword, saltRounds);

  const updatedAccount = await db.query(
    "UPDATE account SET password=$1 WHERE id=$2 returning id",
    [hashedPassword, userId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send(updatedAccount.rows[0]);
});

module.exports = router;
