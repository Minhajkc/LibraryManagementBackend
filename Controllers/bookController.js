const Book = require("../Models/Book");


exports.createBook = async (req, res) => {

  try {
    const { title, author, isbn, publishedYear, availableCopies } = req.body;

    const book = new Book({ title, author, isbn, publishedYear, availableCopies });
    await book.save();

    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Error creating book", error: error.message });
  }
};


exports.getBooks = async (req, res) => {
    try {
      const { page = 1 } = req.query;
      const limit = 10;
      const books = await Book.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
      const totalBooks = await Book.countDocuments();
  
      res.status(200).json({ books, totalBooks, currentPage: page });
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  };
  


exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error searching books", error: error.message });
  }
};


exports.updateBook = async (req, res) => {
    const { bookId } = req.params;
    const { title, author, isbn, publishedYear, availableCopies } = req.body;
  
    try {
      // Find the book by ID
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Update book details
      book.title = title || book.title;
      book.author = author || book.author;
      book.isbn = isbn || book.isbn;
      book.publishedYear = publishedYear || book.publishedYear;
      book.availableCopies = availableCopies || book.availableCopies;
  
      // Save updated book
      await book.save();
  
      res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Error updating book", error: error.message });
    }
};

exports.updateBookAvailability = async (req, res) => {
    const { bookId } = req.params;
    const { isAvailable } = req.body;
  
    try {
      // Find the book by ID
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Update the availability status
      book.isAvailable = isAvailable;
  
      // Save the updated book
      await book.save();
  
      // Respond with the updated book
      res.status(200).json({ message: "Book availability updated", book });
    } catch (error) {
      console.error("Error updating book availability:", error);
      res.status(500).json({ message: "Error updating book availability", error: error.message });
    }
  };

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
};
