// jshint esversion:6
// Dependencies
// ===========================================================
const express = require("express");
const path = require("path");
const app = express();
const fs = require('fs');
app.use(express.json());
const db = require('./db.json');
const {
    notes
} = require("joi");




// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
    extended: true
}));


// look for all the static files in the directory
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static("db"));

/* ---------------------------- Empty Notes Array --------------------------- */

let notesArr = [];

/* ---------------------------- Empty Notes Array --------------------------- */


// Routes
/* ----------------http request; serves browser with home page --------------------- */

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

/* -------------------- http request; serves browser with /notes page-------------------- */

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// The next step should be the data that is entered by the user needs to come back to the 
// server ; add it to the .json file and send it back to the browser?
/* ------------send back json data---------------- */
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
});



/* ------------------------------- post method ------------------------------ */

app.post("/api/notes", function (req, res) {
    console.log(req.body);

    /* ------------------- reading the contents of the file ------------------ */

    fs.readFile("./db/db.json", "utf-8", function (err, data) {
        if (err) throw err;


        /* -------- json.parse changes text into js object and push it into notes array ------- */
        let notes = JSON.parse(data);
        const noteId = notes.length + 1;
        console.log("id: ", noteId);
        noteRequest = req.body;
        const newNote = {
            id: noteId,
            title: noteRequest.title,
            text: noteRequest.text
        };

        // notes.push(newNote)
        // res.json(notes)

        // fs.writeFile('db/db.json', JSON.stringify(notes), function (err) {
        //     if (err) return console.log(err);
        //     console.log('inserted');

        fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), "utf-8", function (err, data) {
            res.status(200).send("Note Saved");
        });

    });
});

app.delete("/api/notes/:id", function (req, res) {
    const deleteId = req.params.id;
    fs.readFile("db/db.json", "utf8", function (error, response) {
        if (error) {
            console.log(error);
        }
        let notes = JSON.parse(response);
        if (deleteId <= notes.length) {
            res.json(notes.splice(deleteId - 1, 1));
            // Reassign the ids of all notes
            for (let i = 0; i < notes.length; i++) {
                notes[i].id = i + 1;
            }
            fs.writeFile("db/db.json", JSON.stringify(notes, null, 2), function (err) {
                if (err) throw err;
            });
        } else {
            res.json(false);
        }
    });
});

// ======================Listening Ports=======================================
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}...`));