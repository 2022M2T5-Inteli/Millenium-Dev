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

//ENDPOINT API CONTA

// endpoint create account Escola
app.post("/contaEscola/create", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Account (nome, email, cargo, idEscola) VALUES(?, ?, ?, ?)";

  // add query params
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);
  params.push(request.body.cargo);
  params.push(request.body.idEscola);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// endpoint create account Rede
app.post("/contaRede/create", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Rede (nome, email, chaveAcesso) VALUES(?, ?, ?)";

  // add query params
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);

  // pushes the chaveAcesso data
  params.push("u&2!X,2vWMCu6$8");
  // params.push(request.body.chaveAcesso);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

//endpoint create account Falconi
app.post("/contaFalconi/create", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO AdminFalconi (nome, email) VALUES(?, ?)";

  // add query params
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);

  // execute query
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// starts the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});