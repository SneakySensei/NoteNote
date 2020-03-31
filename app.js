const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

const port = process.env.PORT

const app = express();
app.use(bodyParser.urlencoded({extended:false}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'notenote',
    charset: 'utf8mb4',
    multipleStatements: true
});

connection.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      console.log(err);
      return;
    }
    console.log('Connection to Db established');
});

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render('top.ejs');
});

app.get('/index', (req, res) => {
    connection.query('SELECT * FROM notes', (error, results) => {
        res.render('index.ejs', {notes: results});
    });
});

app.get('/new', (req, res) => {
    res.render('new.ejs');
})

app.post('/create', (req, res) => {
    connection.query('INSERT INTO notes (text) VALUES (?)', [req.body.text], (error, results) => {
        res.redirect('/index');
    });
});

app.post('/delete/:id', (req, res) => {
    // delete the row
    // remove the id column momentarily
    // recreate the id column to reassign ids
    connection.query('DELETE FROM notes WHERE id = ?; ALTER TABLE notes DROP id; ALTER TABLE notes ADD id MEDIUMINT NOT NULL AUTO_INCREMENT Primary key;',
    [req.params.id],
    (error, results) => {
        res.redirect('/index');
    });
});

app.get('/edit/:id', (req, res) => {
    connection.query('SELECT * FROM notes WHERE id = ?', [req.params.id], (error, results) => {
        res.render('edit.ejs', {note: results[0]});
    });
});

app.post('/update/:id', (req, res) => {
    connection.query('UPDATE notes SET text = ? WHERE id = ?',
    [req.body.text, req.params.id],
    (error, results) => {
        res.redirect('/index');
    });
});

app.listen(port, ()=>{
    console.log("Listening on port 3000");
});