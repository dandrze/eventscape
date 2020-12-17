const db = require("./index");

const updateEmailJob = async (id, emailsSent, nextjob) => {
  const newEmail = await db.query(
    "UPDATE email SET emails_sent=$2, next_job=$3 WHERE id=$1 RETURNING *",
    [id, emailsSent, nextjob],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );
};

exports.updateEmailJob = updateEmailJob;
