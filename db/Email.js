const db = require("./index");
const { statusOptions } = require("../model/enums");

const updateEmailJob = async (
  id,
  triggeredJobs,
  nextInvocation,
  successfulSends,
  failedSends
) => {
  const newEmail = await db.query(
    "UPDATE email SET triggered_jobs=$2, next_invocation=$3, successful_sends=$4, failed_sends=$5 WHERE id=$1 RETURNING *",
    [id, triggeredJobs, nextInvocation, successfulSends, failedSends],
    (err, res) => {
      if (err) {
        console.log(err);
        throw res.status(500).send(err);
      }
    }
  );

  // If the job was triggered, update the status to complete
  if (triggeredJobs === 1) {
    await db.query("UPDATE email SET status=$1 WHERE id=$2", [
      statusOptions.COMPLETE,
      id,
    ]);
  }
};

exports.updateEmailJob = updateEmailJob;
