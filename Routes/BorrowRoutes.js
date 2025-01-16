const express = require("express");
const { borrowBook, returnBook, viewBorrowingHistory } = require("../Controllers/borrowController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const router = express.Router();

router.post("/:bookId", authMiddleware, borrowBook);
router.post("/return/:bookId", authMiddleware, returnBook);
router.get("/history", authMiddleware, viewBorrowingHistory);

module.exports = router;
