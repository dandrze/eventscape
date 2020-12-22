const db = require("./index");

const getEventFromId = async (id) => {
  const event = await db.query(
    "SELECT * FROM event WHERE id=$1",
    [id],
    (err, res) => {
      if (err) {
        throw res.status(500).send(err);
      }
    }
  );

  return event.rows[0];
};

exports.getEventFromId = getEventFromId;
