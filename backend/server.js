require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const userRoutes = require("./routes/userRouter");

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const accessToken = req.headers["x-access-token"];

    const { id, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    if (exp < Date.now().valueOf() / 1000) {
      return res
        .status(401)
        .json({ error: "JWT token expired, you need to login again!" });
    }
    res.locals.loggedInUser = await User.findById(id);
    next();
  } else {
    next();
  }
});

app.use("/api", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT, () => {
      console.log("Server is running");
    });
  })
  .catch((error) => console.log(error));
