const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.listOpcoes = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Alternativa WHERE ativada=1";

  db.all(sql, [], (err, rows) => {
    response.statusCode = 200;
    response.json({ opcoes: rows });
  });
  db.close();
};

exports.listOpcoesByQuestao = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Alternativa WHERE ativada=1 AND idQuestao = ?";

  let params = [];
  params.push(request.params.idQuestao);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ opcoes: rows });
  });
  db.close();
};

exports.createOpcao = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Alternativa (texto, idQuestao, pontuacao, numeroAlt, versao, idAutor) VALUES (?,  (SELECT id FROM Questao WHERE numeroQuestao = ? ORDER BY id DESC), ?, (SELECT (numeroAlt + 1) FROM Alternativa ORDER BY numeroAlt DESC), 1, ?)";

  // creates a list with elements that will replace the "?"
  let params = [];

  // adds the elements to the list
  params.push(request.body.texto);
  params.push(request.body.numeroQuestao);
  params.push(request.body.pontuacao);
  params.push(request.body.idAutor);
  // handles the api reponse status and body
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ rows });
  });
  db.close();
};

exports.updateOpcao = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sqlUpdate = "UPDATE Alternativa SET ativada=0 WHERE id=?;";
  let sqlInsert =
    "INSERT INTO Alternativa (texto, idQuestao, pontuacao, numeroAlt, versao, idAutor) VALUES (?, (SELECT id FROM Questao WHERE numeroQuestao = ? ORDER BY id DESC), ?, ?, (SELECT (versao + 1) FROM Alternativa WHERE numeroAlt=? ORDER BY versao DESC),?);";

  // params' list, replaces "?"
  let paramsUpdate = [];
  let paramsInsert = [];

  // add elements to the Update params list
  paramsUpdate.push(request.body.id);

  // adds the elements to the list
  paramsInsert.push(request.body.texto);
  paramsInsert.push(request.body.numeroQuestao);
  paramsInsert.push(request.body.pontuacao);
  paramsInsert.push(request.body.numeroAlt);
  paramsInsert.push(request.body.numeroAlt);
  paramsInsert.push(request.body.idAutor);
  // handles the api reponse status and body
  db.all(sqlUpdate, paramsUpdate, (err, _) => {
    if (!err) {
      db.all(sqlInsert, paramsInsert, (err, rows) => {
        response.statusCode = 200;
        response.json({ rows });
      });
    }
  });
  db.close();
};

exports.disableOpcao = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "UPDATE Alternativa SET ativada=0 WHERE numeroAlt=?;";

  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.numeroAlt);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    if (err) {
      throw new Error(err);
    }
    response.json(rows);
  });
  db.close();
};
