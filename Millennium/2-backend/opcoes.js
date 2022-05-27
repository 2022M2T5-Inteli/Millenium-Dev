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

// ENDPOINTS API OPCOES

// endpoint for adding question options
app.post("/opcoes/create", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Alternativa (texto, idQuestao, pontuacao, numeroAlt, versao, idAutor) VALUES (?, ?, ?, ?, 1, ?)";

  // creates a list with elements that will replace the "?"
  let params = [];

  // adds the elements to the list
  params.push(request.body.texto);
  params.push(request.body.idQuestao);
  params.push(request.body.pontuacao);
  params.push(request.body.numeroAlt);
  params.push(request.body.idAutor);

  // handles the api reponse status and body
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// endpoint for updating an "option"
app.post("/opcoes/update", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Alternativa (texto, idQuestao, pontuacao, numeroAlt, versao, idAutor) VALUES (?, ?, ?, ?, (SELECT (versao + 1) FROM Alternativa WHERE numeroAlt=? ORDER BY versao DESC),?);";

  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.texto);
  params.push(request.body.idQuestao);
  params.push(request.body.pontuacao);
  params.push(request.body.numeroAlt);
  params.push(request.body.numeroAlt);
  params.push(request.body.idAutor);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    console.log(err);
    response.json(rows);
  });
  db.close();
});

// starts the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
