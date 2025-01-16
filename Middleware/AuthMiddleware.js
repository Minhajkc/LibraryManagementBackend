const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

 const token = req.cookies.token; 


  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
 
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied " });
    }

    next(); 
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
