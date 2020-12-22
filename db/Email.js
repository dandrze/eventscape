const db = require("./index");

const updateEmailJob = async (id, triggeredJobs, nextInvocation) => {
  const newEmail = await db.query(
    "UPDATE email SET triggered_jobs=$2, next_invocation=$3 WHERE id=$1 RETURNING *",
    [id, triggeredJobs, nextInvocation],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );
};

exports.updateEmailJob = updateEmailJob;
