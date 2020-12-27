module.exports = (req, res, next) => {
  if (!req.user) {
    //return res.send({ error: "You must log in" });
    return res.send(null);
  }

  next();
};
