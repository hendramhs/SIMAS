function errorHandler(err, _req, res, _next) {
  if (err && err.message) {
    res.status(400).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
