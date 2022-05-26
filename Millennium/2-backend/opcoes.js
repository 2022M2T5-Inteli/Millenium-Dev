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

// endpoint adicionar opcao
app.post("/opcoes/create", (request, response) => {
    let db = new sqlite3.Database(DBPATH);
    let sql = "INSERT INTO Opcao (texto, idQuestao, pontuacao, numeroAlt, versao, idAutor) VALUES (?, ?, ?, ?, 1, ?)";
    console.log(request.body);

    // cria um JSon com parâmetros que irão substituir os ?
    let params = [];

    // adiciona os parâmetros ao JSon 
    params.push(request.body.texto);
    params.push(request.body.idQuestao);
    params.push(request.body.pontuacao);
    params.push(request.body.numeroAlt);
    params.push(request.body.idAutor);
  
    // responde com o código se deu certo ou não
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
  