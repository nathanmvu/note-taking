const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 2000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

const writefileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

let notes = [];
let journalData = require('./journal');

app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/notes.html'));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/notes', function(req, res) {
  return res.json(notes);
});

app.get('./journal', function(req, res) {
  return res.json(journalData);
});

app.post('/api/notes', function(req, res) {
  let noteEntry = req.body;
  readFileAsync(path.join(__dirname, './journal.json'), 'utf8')
    .then(function(response) {
      notes = JSON.parse(response);
    });
});