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

// endpoints

app.get("/eixos", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Eixo";
  db.all(sql, [], (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

app.post("/eixo/create", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Eixo (nome, idAgenda) VALUES(?,?);";
  console.log(request.body);
  
  // lista de parâmetros, substitui o "?"
  let params = [];

  // Adiciona os elementos na lista de parâmetros
  params.push(request.body.nome);
  params.push(request.body.idAgenda);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// edição de elementos
app.post("/eixo/update", (request, response) => {
    let db = new sqlite3.Database(DBPATH);
    let sql = "SET INTO Eixo (nome, idAgenda) VALUES(?,?);";
    console.log(request.body);
    
    // lista de parâmetros, substitui o "?"
    let params = [];
  
    // Adiciona os elementos na lista de parâmetros
    params.push(request.body.nome);
    params.push(request.body.idAgenda);
  
    db.all(sql, params, (err, rows) => {
      response.statusCode = 200;
      response.json(rows);
    });
    db.close();
  });


  // Remover eixos
app.post("/eixo/update", (request, response) => {
    let db = new sqlite3.Database(DBPATH);
    let sql = "DELETE FROM Eixo (nome, idAgenda) WHERE VALUES(?,?);";
    console.log(request.body);
    
    // lista de parâmetros, substitui o "?"
    let params = [];
  
    // Adiciona os elementos na lista de parâmetros
    params.push(request.body.nome);
    params.push(request.body.idAgenda);
  
    db.all(sql, params, (err, rows) => {
      response.statusCode = 200;
      response.json(rows);
    });
    db.close();
  });


    // Remover eixos
app.post("/eixo/sort", (request, response) => {
    let db = new sqlite3.Database(DBPATH);
    let sql = " INTO Eixo (nome, idAgenda) VALUES(?,?);";
    console.log(request.body);
    
    // lista de parâmetros, substitui o "?"
    let params = [];
  
    // Adiciona os elementos na lista de parâmetros
    params.push(request.body.nome);
    params.push(request.body.idAgenda);
  
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
