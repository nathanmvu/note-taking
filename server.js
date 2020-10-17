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
  res.json(savedNotes[Number(req.params.id)]);
});

app.post('/api/notes', function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let noteEntry = req.body;
  let newId = savedNotes.length;
  noteEntry.id = newId;

  console.log('Note ID is: ' + noteEntry.id);

  savedNotes.push(noteEntry);

  updateDb(savedNotes);
  res.json(noteEntry);
});

app.delete("/api/notes/:id", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let noteID = req.params.id;
  let newID = 0;
  savedNotes.splice(noteID, 1);

  for (note of savedNotes) {
    note.id = newID;
    newID++;
  }
  
  fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
  res.json(noteID);
})

updateDb = (savedNotes) => {
  console.log('updated db');
  fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
}

// Start the server on the port
app.listen(PORT, function() {
  console.log("SERVER IS LISTENING: " + PORT);
});