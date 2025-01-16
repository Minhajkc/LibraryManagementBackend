const express = require("express");
const { borrowBook, returnBook, viewBorrowingHistory,borrowingsOverview, updateBorrowingStatus, updatePending, borrowingsOverviewPending } = require("../Controllers/borrowController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const authenticateJWTAdmin = require("../Middleware/authenticateJWTAdmin")
const router = express.Router();

router.patch("/:bookId",authMiddleware,borrowBook);
router.post("/return/:bookId", authMiddleware, returnBook);
router.get("/history", authMiddleware, viewBorrowingHistory);
router.get("/borrowingsOverview",authenticateJWTAdmin,borrowingsOverview )
router.get("/borrowingsOverviewPending",authenticateJWTAdmin,borrowingsOverviewPending )
router.put("/updateStatus/:id",authenticateJWTAdmin, updateBorrowingStatus);
router.put("/:id/updateStatus",authenticateJWTAdmin, updatePending)

module.exports = router;
