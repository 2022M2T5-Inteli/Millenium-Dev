const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.createQuestionario = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

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
};

exports.setQuestionarioAsComplete = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

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
};

exports.listQuestionarios = (request, response) => {
  response.json({ message: "Not Implemented!" });
};

exports.listQuestionarioById = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

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
};

exports.listQuestionarioRespostas = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql =
    "SELECT r.id, r.idQuestao, q.texto as textoQuestao, r.idAlternativa, a.texto as textoAlternativa, q.idEixo, r.observacao, r.nota FROM Resposta r JOIN Questao q ON r.idQuestao=q.id JOIN Alternativa a ON r.idAlternativa=a.id WHERE r.idQuestionario = ?";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idQuestionario);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ respostas: rows });
  });
  db.close();
};

exports.listQuestionarioRespostasByEixo = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

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
};
