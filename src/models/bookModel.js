const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    availability: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
