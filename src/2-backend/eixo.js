const express = require("express");
const app = express();

// server settings

// listen in all network cards (access it at localhost:80)
const hostname = "0.0.0.0";
const port = 80;

// loads sqlite3 database
const sqlite3 = require("sqlite3").verbose();
const DBPATH = "Database/dbFalconi.db";

// shows frontend
app.use(express.static("../1-frontend/"));

// use json as middleware
app.use(express.json());

// ENDPOINTS API EIXO

// endpoint for listing "eixos"
app.get("/eixos", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Eixo";
  db.all(sql, [], (err, rows) => {
    response.statusCode = 200;
    response.json({ eixos: rows });
  });
  db.close();
});

// endpoint for creating an "eixo"
app.post("/eixo/create", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Eixo (nome, idAgenda) VALUES(?,?);";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.nome);
  params.push(request.body.idAgenda);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// endpoint for updating an "eixo"
app.post("/eixo/update", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "UPDATE Eixo SET nome = ?, idAgenda = ? WHERE id = ?;";

  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.nome);
  params.push(request.body.idAgenda);
  params.push(request.body.idEixo);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// endpoint for removing an "eixo"
app.post("/eixo/delete", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "DELETE FROM Eixo WHERE id = ?;";

  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.idEixo);

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
