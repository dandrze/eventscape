const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const router = express.Router();

router.put("/api/account", async (req, res) => {
  const { userId, contactData } = req.body;
  const { first_name, last_name, email } = contactData;

  const updatedAccount = await db.query(
    "UPDATE user_account SET first_name=$1, last_name=$2, email=$3 WHERE id=$4 RETURNING first_name, last_name, email, id",
    [first_name, last_name, email, userId],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  res.status(200).send(updatedAccount.rows[0]);
});

router.put("/api/account/pw", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  const existingUser = await db.query(
    "SELECT password from user_account where id=$1",
    [userId]
  );

  // if the password doesn't match, return an 401 unauthorized error
  if (oldPassword != existingUser.rows[0].password) {
    return res.status(401).send({ error: "Current password is not correct" });
  }

  // has the password so we don't store the plain text password in our database
  const hashedPassword = await bcrypt.hashSync(newPassword, saltRounds);

  const updatedAccount = await db.query(
    "UPDATE user_account SET password=$1 WHERE id=$2 returning id",
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
