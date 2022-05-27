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

// ENDPOINTS API Questoes

// endpoint for adding new questions
app.get("/questoes/:idEixo", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questao WHERE idEixo = ?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idEixo);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questoes: rows });
  });
  db.close();
});

// endpoint for creating new questions
app.post("/questoes/create", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Questao (texto, numeroQuestao, peso, idDominio, idAutor, idEixo, versao) VALUES(?, ?, ?, ?, ?, ?, 1)";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.texto);
  params.push(request.body.numeroQuestao);
  params.push(request.body.peso);
  params.push(request.body.idDominio);
  params.push(request.body.idAutor);
  params.push(request.body.idEixo);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questoes: rows });
  });
  db.close();
});

// endpoint for updating a "question"
app.post("/questao/update", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Questao (texto, numeroQuestao, peso, idDominio, idAutor, idEixo, versao) VALUES(?, ?, ?, ?, ?, ?,(SELECT (versao + 1) FROM Questao WHERE numeroQuestao=? ORDER BY versao DESC));";

  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.texto);
  params.push(request.body.numeroQuestao);
  params.push(request.body.peso);
  params.push(request.body.idDominio);
  params.push(request.body.idAutor);
  params.push(request.body.idEixo);
  params.push(request.body.numeroQuestao);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// endpoint for returning a question
app.get("/questao/:idQuestao", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questao WHERE id = ?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idQuestao);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questao: rows[0] });
  });
  db.close();
});

// ENDPOINTS API Questionarios

// endpoint for retrieving "Questionarios"
app.get("/escolas/:idEscola", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Escola WHERE codeEscola = ?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idEscola);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ escola: rows[0] });
  });
  db.close();
});

// endpoint for retrieving "Questionarios"
app.get("/escolas/:idEscola/questionarios", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questionario WHERE idEscola = ?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idEscola);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questionarios: rows });
  });
  db.close();
});

// endpoint for creating a "Questionario"
app.post("/questionarios/create", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "INSERT INTO Questionario(idEscola,isComplete) VALUES(?,1)";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.idEscola);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// endpoint for disabling a "Questionario"
app.post("/questionarios/complete", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "UPDATE Questionario SET isComplete = 0 WHERE id = ?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.idQuestionario);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
});

// endpoint for listing a "Questionario" by id
app.get("/questionarios/:idQuestionario", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questionario WHERE id=?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idQuestionario);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questionario: rows[0] });
  });
  db.close();
});

// endpoint for listing a "Questionario" answered questions
app.get("/questionarios/:idQuestionario/questoes", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql =
    "SELECT r.id, r.idQuestao, q.texto as textoQuestao, r.idAlternativa, a.texto as textoAlternativa, q.idEixo, r.observacao, r.nota FROM Resposta r JOIN Questao q ON r.idQuestao=q.id JOIN Alternativa a ON r.idAlternativa=a.id WHERE r.idQuestionario = ?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idQuestionario);
  params.push(request.params.idEixo);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ respostas: rows });
  });
  db.close();
});

// endpoint for listing a "Questionario" answered questions by eixo
app.get(
  "/questionarios/:idQuestionario/questoes/eixo/:idEixo",
  (request, response) => {
    let db = new sqlite3.Database(DBPATH);
    let sql =
      "SELECT r.id, r.idQuestao, q.texto as textoQuestao, r.idAlternativa, a.texto as textoAlternativa, q.idEixo, r.observacao, r.nota FROM Resposta r JOIN Questao q ON r.idQuestao=q.id JOIN Alternativa a ON r.idAlternativa=a.id WHERE r.idQuestionario = ? AND q.idEixo = ? ";

    // params list, replaces "?"
    let params = [];

    // add elements to the params list
    params.push(request.params.idQuestionario);
    params.push(request.params.idEixo);

    db.all(sql, params, (err, rows) => {
      response.statusCode = 200;
      response.json({ respostas: rows });
    });
    db.close();
  }
);

// starts the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
