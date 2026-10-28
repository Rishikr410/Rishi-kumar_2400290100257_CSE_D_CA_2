const Book = require('../models/bookModel');
const mongoose = require('mongoose');

const createBook = async (req, res) => {
  try {
    const { title, author, category, availability } = req.body || {};

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (typeof author !== 'string' || !author.trim()) {
      return res.status(400).json({ message: 'Author is required' });
    }

    if (typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      ...(availability !== undefined && { availability }),
    });

    return res.status(201).json({
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Error creating book:', error);
    return res.status(500).json({
      message: 'Error creating book',
    });
  }
};

const getBooks = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
      return res.status(400).json({
        message: 'Page and limit must be positive whole numbers',
      });
    }

    const skip = (page - 1) * limit;

    const [books, totalRecords] = await Promise.all([
      Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments(),
    ]);

    return res.status(200).json({
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      books,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({
      message: 'Error fetching books',
    });
  }
};

const updateBookAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body || {};

    if (typeof availability !== 'string' || !['available', 'unavailable'].includes(availability)) {
      return res.status(400).json({
        message: 'Availability must be either available or unavailable',
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { availability },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({
      message: 'Book availability updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    console.error('Error updating book availability:', error);
    return res.status(500).json({
      message: 'Error updating book availability',
    });
  }
};

module.exports = {
  createBook,
  getBooks,
  updateBookAvailability,
};
