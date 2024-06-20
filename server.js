const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const dbURI = 'mongodb://localhost:27017/mydatabase'; // Замените mydatabase на название вашей базы данных
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for your data
const cardSchema = new mongoose.Schema({
  title: String,
  type: String,
  addedAt: { type: Date, default: Date.now }
});

const Card = mongoose.model('Card', cardSchema);

// API routes
app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

app.post('/cards', async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();
    res.json(newCard);
  } catch (error) {
    console.error('Error saving card:', error);
    res.status(500).json({ error: 'Failed to save card' });
  }
});

app.delete('/cards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Card.findByIdAndDelete(id);
    res.json({ message: 'Card deleted' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
