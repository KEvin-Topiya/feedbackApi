const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://lawilih588:Abcd1234@lawilih588.ogord.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// API Endpoint to Return a Hello Message
app.get('/', (req, res) => {
  res.status(200).json({ message: "Hi Whatsuppp..." });
});

// API Endpoint to Fetch All Feedback Data
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); // Fetch all feedback documents
    res.status(200).json(feedbacks); // Return the feedback data as JSON
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching feedback data.' });
  }
});


// API Endpoint to Add Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newFeedback = new Feedback({
      name,
      email,
      message,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving feedback.' });
  }
});




  // API Endpoint to Delete Feedback by ID
app.delete('/api/feedback/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get the feedback ID from the URL
  
      // Check if the ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid feedback ID.' });
      }
  
      // Find and delete the feedback
      const deletedFeedback = await Feedback.findByIdAndDelete(id);
  
      // Check if feedback was found and deleted
      if (!deletedFeedback) {
        return res.status(404).json({ error: 'Feedback not found.' });
      }
  
      res.status(200).json({ message: 'Feedback deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting feedback.' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});