const express = require("express");
const { createBook, getBooks, searchBooks, updateBook, deleteBook, updateBookAvailability  } = require("../Controllers/bookController");
const authenticateJWTAdmin = require("../Middleware/authenticateJWTAdmin");
const router = express.Router();


router.post("/Createbook",authenticateJWTAdmin,createBook);
router.patch("/:bookId/availability",authenticateJWTAdmin,updateBookAvailability);
router.patch("/:bookId",authenticateJWTAdmin,updateBook);
router.get("/getbooks", getBooks);
router.get("/search", searchBooks);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
