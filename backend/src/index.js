require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const env = require("./config/env");
const diseaseRoutes = require("./modules/diseases/diseases.routes");
const reportRoutes = require("./modules/reports/reports.routes");
const statsRoutes = require("./modules/stats/stats.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: env.appOrigin }));
app.use(express.json());
app.use("/uploads", express.static(path.resolve(env.uploadDir)));

app.get("/api/health", (_req, res) => {
  res.json({ message: "HealthTrack API is running" });
});

app.use("/api/diseases", diseaseRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/stats", statsRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`HealthTrack backend listening on port ${env.port}`);
});
