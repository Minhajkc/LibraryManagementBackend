const Book = require("../Models/Book");
const User = require("../Models/User");


exports.borrowBook = async (req, res) => {
    const { bookId } = req.params;
  const userId = req.user.id; // Assuming req.user contains authenticated user details

  try {
    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book has available copies
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available for borrowing" });
    }

    // Decrease the available copies
    book.availableCopies -= 1;

    // If available copies become 0, mark as unavailable
    if (book.availableCopies === 0) {
      book.isAvailable = false;
    }

    await book.save();

    // Update user's borrowing history
    const user = await User.findById(userId);
    user.borrowingHistory.push({
      bookId: book._id,
      borrowedAt: new Date(),
      returnDate: new Date(),
      status: "pending", // Initial status
    });

    await user.save();

    res.status(200).json({ message: "Book borrowed successfully", book });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({ message: "Internal server error" });
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

exports.borrowingsOverview = async (req,res) => {
    try {
        // Fetch all users with their borrowing history
        const users = await User.find({}, "name email borrowingHistory")
          .populate("borrowingHistory.bookId", "title")
          .exec();
          console.log(users)
    
        // Calculate total active borrowings
        const totalActiveBorrowings = users.reduce(
          (sum, user) =>
            sum + user.borrowingHistory.filter((b) => b.status === "pending").length,
          0
        );
    
        res.status(200).json({
          totalActiveBorrowings,
          users,
        });
      } catch (error) {
        console.error("Error fetching borrowings overview:", error);
        res.status(500).json({ message: "Server error" });
      }
}


exports.borrowingsOverviewPending = async (req, res) => {
    try {
      // Fetch all users with their borrowing history
      const users = await User.find({}, "name email borrowingHistory")
        .populate("borrowingHistory.bookId", "title")
        .exec();
      console.log(users);
  
      // Filter users to only include those with pending borrowings
      const usersWithPending = users.filter((user) =>
        user.borrowingHistory.some((borrowing) => borrowing.status === "pending")
      );
  
      // Calculate total active borrowings
      const totalActiveBorrowings = usersWithPending.reduce(
        (sum, user) =>
          sum + user.borrowingHistory.filter((b) => b.status === "pending").length,
        0
      );
  
      res.status(200).json({
        totalActiveBorrowings,
        users: usersWithPending, // Return only users with pending borrowings
      });
    } catch (error) {
      console.error("Error fetching borrowings overview:", error);
      res.status(500).json({ message: "Server error" });
    }
  };



exports.updateBorrowingStatus = async (req, res) => {
    const { id } = req.params; // borrowId
    const { status, userId } = req.body; // userId sent in the request body
  
    try {
      // Find the user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Find the borrowing in the user's borrowingHistory
      const borrowing = user.borrowingHistory.id(id);
      if (!borrowing) {
        return res.status(404).json({ message: "Borrowing not found" });
      }
  
      // Update the status
      borrowing.status = status;
  
      // Save the user document
      await user.save();
  
      res.status(200).json({ message: "Status updated successfully", borrowing });
    } catch (error) {
      console.error("Error updating borrowing status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};


exports.updatePending = async (req,res) =>{
    const { id } = req.params; // borrowingId
  const { status, userId } = req.body; // userId sent in the request body
  
  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the borrowing in the user's borrowingHistory by borrowingId
    const borrowing = user.borrowingHistory.id(id); // Accessing borrowing document by its _id
    if (!borrowing) {
      return res.status(404).json({ message: "Borrowing not found" });
    }

    // Update the status of the borrowing
    borrowing.status = status;

    // Save the user document to persist the changes
    await user.save();

    // Send a success response with updated borrowing info
    res.status(200).json({ message: "Status updated successfully", borrowing });
  } catch (error) {
    console.error("Error updating borrowing status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
