const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// HTML Routes
app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// API Routes
app.get('/api/notes', function(req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

// Getting notes by ID
app.get("/api/notes/:id", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(savedNotes[req.params.id]);
});

// To save notes to db.json
app.post('/api/notes', function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let noteEntry = req.body;
  // ID for note based on length of notes in database array
  let newId = savedNotes.length.toString();
  noteEntry.id = newId;
  // Adding new note to savedNotes
  savedNotes.push(noteEntry);

  fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
  res.json(noteEntry);
});

app.delete("/api/notes/:id", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let noteID = req.params.id;
  let newID = 0;
  // Deleting note based on ID
  savedNotes.splice(noteID, 1);

  // resetting note IDs by order
  for (note of savedNotes) {
    note.id = newID.toString();
    newID++;
  }
  
  fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
  res.json(noteID);
})

// Start the server on the port
app.listen(PORT, function() {
  console.log("SERVER IS LISTENING: " + PORT);
});