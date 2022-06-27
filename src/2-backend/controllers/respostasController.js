const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.createResposta = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql =
    "UPDATE Resposta SET observacao = ?, idAlternativa = ?, nota = (SELECT pontuacao FROM Alternativa a WHERE a.id=?) WHERE idQuestao= ? AND idQuestionario = ?;";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.observacao);
  params.push(request.body.idAlternativa);
  params.push(request.body.idAlternativa);
  params.push(request.body.idQuestao);
  params.push(request.body.idQuestionario);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json(rows);
  });
  db.close();
};
