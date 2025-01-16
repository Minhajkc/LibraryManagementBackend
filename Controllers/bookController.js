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
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error: error.message });
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
