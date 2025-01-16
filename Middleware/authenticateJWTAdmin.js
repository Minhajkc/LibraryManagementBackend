const jwt = require("jsonwebtoken");

const authenticateJWTAdmin = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from cookies
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    console.log(decoded)

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next(); 
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateJWTAdmin;
