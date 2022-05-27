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

// ENDPOINTS API Questoes

// endpoint for listing questions
app.get("/questoes", (request, response) => {
  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questao";

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
  let sql = "INSERT INTO Questionario(idEscola,isComplete) VALUES(?,0)";

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
  let sql = "UPDATE Questionario SET isComplete = 1 WHERE id = ?";

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
