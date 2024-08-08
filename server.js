const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/dailyNotes', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Schema and Model
const noteSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },
    content: { type: String, required: true }
});

const Note = mongoose.model('Note', noteSchema);

// Get note by date
app.get('/api/notes/:date', async (req, res) => {
    try {
        const note = await Note.findOne({ date: req.params.date });
        res.json(note);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add or update note
app.post('/api/notes', async (req, res) => {
    const { date, content } = req.body;
    try {
        const note = await Note.findOneAndUpdate({ date }, { content }, { upsert: true, new: true });
        res.json(note);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete note by date
app.delete('/api/notes/:date', async (req, res) => {
    try {
        await Note.findOneAndDelete({ date: req.params.date });
        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err);
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
