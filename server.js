require('dotenv').config();

const express = require('express');
const connectDB = require('./src/config/db');
const bookRoutes = require('./src/routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Library API is running' });
});

app.use('/api/books', bookRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must contain valid JSON' });
  }

  console.error('Unexpected server error:', err);
  return res.status(500).json({ message: 'Something went wrong' });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Could not start the server:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
