const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer();

const notesFilePath = path.join(__dirname, "notes.json");


app.use(express.json());

app.use(express.static("static"));



app.get("/notes", (req, res) => {
    try {
        const notesData = fs.readFileSync(notesFilePath);
        const notes = JSON.parse(notesData);
        res.json(notes);
    } catch (err) {
        res.json([]);
    }
});

app.get("/UploadForm.html", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "UploadForm.html"));
});


app.post("/upload", upload.none(), (req, res) => {
    const noteName = req.body.note_name;
    const noteText = req.body.note;

    console.log(noteName);
    console.log(noteText);

    try {
        const notesData = fs.readFileSync(notesFilePath);
        const notes = JSON.parse(notesData);

        if (notes.hasOwnProperty(noteName)) {
            res.status(400).send("Note with the same name already exists");
        } else {
            notes[noteName] = noteText;
            fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
            res.status(201).send("Note uploaded successfully");
        }
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

app.get("/notes/:noteName", (req, res) => {
    const noteName = req.params.noteName;

    try {
        const notesData = fs.readFileSync(notesFilePath);
        const notes = JSON.parse(notesData);

        if (notes.hasOwnProperty(noteName)) {
            res.send(notes[noteName]);
        } else {
            res.status(404).send("Note not found");
        }
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

app.put("/notes/:noteName", (req, res) => {

    const noteName = req.params.noteName;
    const newNoteText = req.body.note; // This should be a string

    try {

        const notesData = fs.readFileSync(notesFilePath, 'utf8');
        const notes = JSON.parse(notesData);


        if (notes.hasOwnProperty(noteName)) {

            notes[noteName] = newNoteText;


            fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf8');
            res.send("Note updated successfully");
        } else {

            res.status(404).send("Note not found");
        }
    } catch (err) {
        // Log and return an error message
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});




app.delete("/notes/:noteName", (req, res) => {
    const noteName = req.params.noteName;

    try {
        const notesData = fs.readFileSync(notesFilePath, 'utf8');
        const notes = JSON.parse(notesData);

        if (notes.hasOwnProperty(noteName)) {
            delete notes[noteName];
            fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
            res.send("Note deleted successfully");
        } else {
            res.status(404).send("Note not found");
        }
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
