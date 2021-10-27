const router = require("express").Router();
const AuthController = require("../controllers/authController");
const authController = new AuthController();

router.route("/signup").post(authController.signUp);
router.route("/signin").post(authController.signIn);

module.exports = router;
