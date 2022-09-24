const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql");
const app = express();

dotenv.config();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// connect to mysql
let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbbook",
});

app.get("/", (req, res) => {
  res.send("Welcome to node and express.");
});

// get all books
app.get("/api/books", (req, res) => {
  //let q = req.query.q;
  let sql = "select *from tblbook";
  conn.query(sql, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// create books
app.post("/api/books", (req, res) => {
  let sql = "insert into tblbook(title,author,published) values(?)";
  let value = [req.body.title, req.body.author, req.body.date];

  conn.query(sql, [value], (err) => {
    if (err) return res.json(err);
    return res.json("Book has been created successfully.");
  });
});

// delete book
app.delete("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const sql = "delete from tblbook where id = ?";
  conn.query(sql, [bookId], (err, data) => {
    if (err) return res.json(err);
    res.json("Book has been deleted successfully.");
  });
});

// update book
app.put("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const value = [req.body.title, req.body.author, req.body.date];
  const sql = "update tblbook set title=?,author=?,published=? where id=?";
  conn.query(sql, [...value, bookId], (err, data) => {
    if (err) return res.json(err);
    res.json("Book has been updated.");
  });
});

// get book by id
app.get("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const sql = "select *from tblbook where id=?";
  conn.query(sql, [bookId], (err, data) => {
    if (err) return res.json(err);
    res.send(data);
  });
});

// handle search request
app.get("/api/query", (req, res) => {
  let { q } = req.query;
  let sql = "select *from tblbook where title LIKE concat(?,'%') OR id = ?";
  conn.query(sql, [q, q], (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// check book exit
app.get("/api/validate", (req, res) => {
  const { q } = req.query;
  const sql = "select title from tblbook where title=?";
  conn.query(sql, [q.trim()], (err, data) => {
    if (err) throw err;
    if (data.length === 0) {
      res.send(false);
    } else {
      res.send("Book already exist...!");
    }
  });
});

app.get("/api/valupdate", (req, res) => {
  const { q } = req.query;
  const sql = "select id,title from tblbook where title=?";
  conn.query(sql, [q], (err, data) => {
    if (err) throw err;
    if (data.length === 0) {
      res.send(false);
    } else {
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
