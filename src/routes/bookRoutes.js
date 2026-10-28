const express = require('express');
const {
  createBook,
  getBooks,
  updateBookAvailability,
} = require('../controllers/bookController');

const router = express.Router();

router.post('/', createBook);
router.get('/', getBooks);
router.patch('/:id', updateBookAvailability);

module.exports = router;
