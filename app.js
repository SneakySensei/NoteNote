const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
require('dotenv').config();

const port = process.env.PORT

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public')); //redefining where static files are stored

var file = "notenote.db";
const db = new sqlite3.Database(file);

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS notes ('text' LONGTEXT NULL)");
});

app.get("/", (req, res) => {
    res.render('top.ejs');
});

app.get('/index', (req, res) => {

    db.all("SELECT rowid, text FROM notes", (error, result) => {
        res.render('index.ejs', {notes: result});
    })
});

app.get('/new', (req, res) => {
    res.render('new.ejs');
})

app.post('/create', (req, res) => {
    db.all('INSERT INTO notes (text) VALUES (?)', [req.body.text], (error, results) => {
        res.redirect('/index');
    });
});

app.post('/delete/:id', (req, res) => {
    db.all('DELETE FROM notes WHERE rowid = ?', [req.params.id], (error, results) => {
        res.redirect('/index');
    });
});

app.get('/edit/:id', (req, res) => {
    db.all('SELECT rowid, text FROM notes WHERE rowid = ?', [req.params.id], (error, results) => {
        res.render('edit.ejs', {note: results[0]});
    });
});

app.post('/update/:id', (req, res) => {
    db.all('UPDATE notes SET text = ? WHERE rowid = ?',
    [req.body.text, req.params.id],
    (error, results) => {
        res.redirect('/index');
    });
});

app.listen(port, ()=>{
    console.log("Listening on port 3000");
});