const router = require("express").Router();
const UserController = require("../controllers/userController");
const userController = new UserController();

router.route("/").get(userController.getUsers).post(userController.addUser);
router
  .route("/:userId")
  .get(userController.getUser)
  .patch(userController.editUser)
  .put(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
