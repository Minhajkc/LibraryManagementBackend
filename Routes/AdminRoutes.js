const express = require("express");
const {loginAdmin, isAuth} = require("../Controllers/adminController");
const router = express.Router();
const authenticateJWTAdmin = require('../Middleware/authenticateJWTAdmin')

router.post("/login",loginAdmin );
router.get("/verify", authenticateJWTAdmin,isAuth)
  

module.exports = router;
