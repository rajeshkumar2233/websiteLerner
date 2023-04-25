const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ========= Registration ==============
const register = async (req, res) => {
    try {
        let data = req.body
        let {name, email, password} = data;
        
        if (!name) {
            return res.status(400).json("name is required");
        }
        if (!email) {
            return res.status(400).json("email is required");
        }
        const Emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let Email = Emailregx.test(email);
        if (!Email) {
            return res.status(400).json("Please enter valid mail address");
        }

        const dublicateEmail = await userModel.findOne({ email });
        if (dublicateEmail) {
        return res.status(400).json(" Email Already Exists");
        }

        if (!password) {
            return res.status(400).json("password is required");
        }
        const Passregx = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,}$/;
        let Password = Passregx.test(password);
        if (!Password) {
        return res.status(400).json(
            "Password must have atleast 1 uppercase\n, 1 lowercase, 1 special charecter\n 1 number and must consist atleast 8 charectors."
            );
        }
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        let saveData = await userModel.create(data)
        return res.status(201).json("Regisration successful")
        
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

// ========= Login ==============
const login = async (req, res) => {
    try {
        let data = req.body;
        let { email, password } = data;

        if (!email) {
            return res.status(400).json("email is required");
        }

        if (!password) {
            return res.status(400).json("password is required");
        }

        let getUser = await userModel.findOne({  email });
        if (!getUser) return res.status(401).json("Email or Password is incorrect.");
        
        let matchPassword = await bcrypt.compare(password, getUser.password);
        if (!matchPassword) return res.status(401).json("Email or Password is incorrect.");

        const token = jwt.sign({
              userId: getUser._id.toString(),
            },"secrete_code_01",
            { expiresIn: "1h" }
            );
        const { newPassword, ...other } = getUser
        let user = getUser

        res.cookie("access_token", token, {
            httpOnly: true,
        })
        .status(201).json({ user, token });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

// ========= fetchUserData ==============
const fetchUserData = async (req, res) => {
    try {
        let id = req.params.id
        let findUser = await userModel.findById(id)
        if (!findUser) {
            return res.status(400).json("User not found")
        }
        return res.status(200).json(findUser);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

// ========= Logout ==============
const logout = async (req, res) => {
    try {
        res.clearCookie("cookies_token", {
            sameSite: "none",
            secure: true,
        }).status(200).json("logged out successfully");

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {register, login, logout, fetchUserData}