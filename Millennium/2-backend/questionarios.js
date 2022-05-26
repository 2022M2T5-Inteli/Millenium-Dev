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

// use json as middlewares
app.use(express.json());

// endpoints para add questoes

app.get("/questoes/:idEixo", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questao WHERE idEixo = ?";
  let params = [];
  params.push(request.params.idEixo);
  db.all(sql, [], (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

app.post("/questoesCreate", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Questao (texto, numeroQuestao, peso, idDominio, idAutor, idEixo, versao) VALUES(?, ?, ?, ?, ?, ?, ?)";
  console.log(request.body);
  let params = [];
  params.push(request.body.texto);
  params.push(request.body.numeroQuestao);
  params.push(request.body.peso);
  params.push(request.body.idDominio);
  params.push(request.body.idAutor);
  params.push(request.body.idEixo);
  params.push(request.body.versao);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});
 
app.get("/questao/:idQuestao", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questao WHERE idQuestao = ?";
  let params = [];
  params.push(request.params.idEixo);
  db.all(sql, [], (err, rows) => {
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