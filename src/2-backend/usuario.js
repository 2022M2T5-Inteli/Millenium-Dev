const express = require("express");
const app = express();

// server settings

// listen in all network cards (access it at localhost:80)
const hostname = "0.0.0.0";
const port = 80;

// loads sqlite3 database
const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/dbFalconi.db";

// shows frontend
app.use(express.static("../1-frontend/"));

// use json as middleware
app.use(express.json());

// ENDPOINTS API USUÁRIO

// api usuário escola

app.get("/usuarioEscola/:AccountId", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let params = [];
  params.push(request.params.AccountId);
  let sql = "SELECT * FROM Account WHERE id=?";

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ user: rows[0] });
  });
  db.close();
});

// api usuário rede

app.get("/usuarioRede/:AccountId", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let params = [];
  params.push(request.params.AccountId);
  let sql = "SELECT * FROM Rede WHERE id=?";

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ user: rows[0] });
  });
  db.close();
});

// api usuário falconi

app.get("/usuarioFalconi/:AccountId", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let params = [];
  params.push(request.params.AccountId);
  let sql = "SELECT * FROM AdminFalconi WHERE id=?";

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ user: rows[0] });
  });
  db.close();
});

// starts the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
