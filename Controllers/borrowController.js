const Book = require("../Models/Book");
const User = require("../Models/User");


exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({ message: "Book not available" });
    }

    const user = await User.findById(req.user.id);
    user.borrowingHistory.push({
      bookId,
      borrowedAt: new Date(),
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    book.availableCopies -= 1;
    await book.save();

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error borrowing book", error: error.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    const borrowRecord = user.borrowingHistory.find(
      (record) => record.bookId.toString() === bookId
    );

    if (!borrowRecord) {
      return res.status(400).json({ message: "No borrowing record found for this book" });
    }

    user.borrowingHistory = user.borrowingHistory.filter(
      (record) => record.bookId.toString() !== bookId
    );
    await user.save();

    const book = await Book.findById(bookId);
    book.availableCopies += 1;
    await book.save();

    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error: error.message });
  }
};

// View borrowing history
exports.viewBorrowingHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("borrowingHistory.bookId");

    res.status(200).json(user.borrowingHistory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching borrowing history", error: error.message });
  }
};
