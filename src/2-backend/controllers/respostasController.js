const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.questionarioResposta = (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
  
    let db = new sqlite3.Database(DBPATH);
    "SELECT From Resposta(idQuestao, idPergunta, idOpcao, observacao) Values(?,?,?,?);";
  
    // params list, replaces "?"
    let params = [];
  
    // add elements to the params list
    params.push(request.body.questionarioResposta);
    db.all(sql, params, (err, rows) => {
      response.statusCode = 200;
      response.json(rows);
    });
    db.close();
  };