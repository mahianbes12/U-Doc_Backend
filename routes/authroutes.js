const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getaUser,
  update,
  deleteUser,
  login,
} = require("../controller/ctrl");

router.post("/user", createUser);
router.get("/users", getAllUsers);
router.get("/aUser", getaUser);
router.put("/:id", update);
router.delete("/:id", deleteUser);
router.post("/:id", login);

module.exports = router;