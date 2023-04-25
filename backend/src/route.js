const express = require('express');
const router = express.Router()
const userController= require("./controllers/userController")

router.get("/", (req, res) => {
    return res.status(200).json("Api is working...")
})

// ======================================USER API============================================//
router.post("/register",userController.register)
router.post("/login",userController.login)
router.post("/logout",userController.logout)
router.get("/user/:id",userController.fetchUserData)

module.exports=router