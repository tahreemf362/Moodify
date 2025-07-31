const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow frontend access
app.use(express.json()); // to handle JSON POST requests

let quotes = [
  { id: 1, mood: 'happy', text: "Happiness is a journey, not a destination." },
  { id: 2, mood: 'sad', text: "Tears come from the heart, not the brain." },
  { id: 3, mood: 'motivated', text: "Push yourself, because no one else is going to do it for you." },
  { id: 4, mood: 'angry', text: "For every minute you're angry, you lose 60 seconds of happiness." }
];

// GET all quotes
app.get('/api/quotes', (req, res) => {
  res.json(quotes);
});

// GET quote by mood
app.get('/api/quotes/:mood', (req, res) => {
  const mood = req.params.mood.toLowerCase();
  const filtered = quotes.filter(q => q.mood === mood);
  if (filtered.length === 0) {
    return res.status(404).json({ message: 'No quotes found for this mood.' });
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  res.json(random);
});

// POST new quote
app.post('/api/quotes', (req, res) => {
  const { mood, text } = req.body;
  if (!mood || !text) {
    return res.status(400).json({ message: 'Mood and text are required.' });
  }
  const newQuote = {
    id: quotes.length > 0 ? quotes[quotes.length - 1].id + 1 : 1,
    mood: mood.toLowerCase(),
    text
  };
  quotes.push(newQuote);
  res.status(201).json(newQuote);
});

// DELETE quote
app.delete('/api/quotes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = quotes.findIndex(q => q.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Quote not found.' });
  }
  const deletedQuote = quotes.splice(index, 1);
  res.json({ message: 'Quote deleted', deletedQuote });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});