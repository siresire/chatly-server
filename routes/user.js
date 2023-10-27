const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


router.get("/get-me", authController.protect, userController.getMe);
router.get("/get-users", authController.protect, userController.getUsers);
router.get("/get-requests", authController.protect, userController.getRequests);
router.get("/get-friends", authController.protect, userController.getFriends);


module.exports = router;