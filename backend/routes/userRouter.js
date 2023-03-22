const express = require("express");
const router = express.Router();
const userControllerLog = require("../controllers/userControllerLog");
const userControllerGet = require("../controllers/userControllerGet");

router.post("/signup", userControllerLog.signup);
router.post("/login", userControllerLog.login);

router.get(
  "/users",
  userControllerGet.getUsers
);
router.get(
  "/user/:id",
  userControllerGet.getUser
);

router.patch(
  "/users/:id",
  userControllerGet.updateUser
);
router.delete(
  "/users/:id",
  userControllerGet.deleteUser
);

module.exports = router;
