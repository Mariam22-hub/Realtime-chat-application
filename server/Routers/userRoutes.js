const express = require('express');
const router = express.Router();
const userController = require("../Controllers/userController");

router.route("/register").post(userController.resgisterUser);
router.route("/login").post(userController.loginUser);
router.route("/find/:id").get(userController.findUser);
router.route("/").get(userController.getUsers)
module.exports = router;