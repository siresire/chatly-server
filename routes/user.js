const router = require("express").Router();

const authController = require("../controllers/authController");
const userControler = require("../controllers/userController");

router.patch("/update-me", authController.protect ,userControler.updateMe);


module.exports = router;