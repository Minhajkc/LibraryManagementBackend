const Admin = require ('../Models/Admin')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, 
      });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.isAuth = async (req,res)=>{
    console.log('verified')
    try {
        res.status(200).json({ message: "Welcome, Admin!" });
    } catch (error) {
        res.status(500).json({ message: "Authentication failed.", error: error.message });
    }
}