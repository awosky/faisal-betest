"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middlewares/authMiddleware");
const mongodb = require("./services/mongodb");
mongodb.connect();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (_, res) =>
  res.send(
    "Welcome! see the github for detail documentation : https://github.com/awosky/faisal-betest "
  )
);
app.use("/auth", require("./routes/authRoute"));
app.use(
  "/user",
  [authMiddleware.verifyAccessToken],
  require("./routes/userRoute")
);
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
