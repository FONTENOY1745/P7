const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// Route concernant le cas des utilisateurs :

router.get("/single/:id", userCtrl.getOneUser);
router.get("/recent", userCtrl.getLastSignup);
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.delete("/delete/:id", userCtrl.deleteUser);

module.exports = router;
