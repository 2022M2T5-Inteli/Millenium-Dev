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

// endpoints

app.get("/agendas", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Agenda";
  db.all(sql, [], (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

//ENDPOINT API CONTA

//endpoint create account Escola
app.post("/contaEscola/create", (request, repost) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Acount (nome, email, cargo, idEscola) VALUES(?, ?, ?, ?)";
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);
  params.push(request.body.cargo);
  params.push(request.body.idEscola);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

//endpoint create account Rede
app.post("/contaRede/create", (request, repost) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Acount (nome, email, chaveAcesso) VALUES(?, ?, ?)";
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);
  params.push(request.body.chaveAcesso);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

//endpoint create account Falconi
app.post("/contaFalconi/create", (request, repost) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Acount (nome, email) VALUES(?, ?)";
  let params = [];
  params.push(request.body.nome);
  params.push(request.body.email);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// // returns the workExperience list
// app.get("/workExperience", (req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   let db = new sqlite3.Database(DBPATH);
//   let sql = "SELECT * FROM workExperience ORDER BY startDate";
//   let params = [];

//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       throw err;
//     }

//     // response
//     res.json({ workExperiences: rows });
//   });
//   db.close();
// });

// starts the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
