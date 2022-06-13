const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.listQuestoes = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questao WHERE ativada=1";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idEixo);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questoes: rows });
  });
  db.close();
};

exports.listQuestoesByEixo = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questao WHERE idEixo = ? AND ativada=1";
  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idEixo);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    let hashmap = {};
    let questoesFiltered = [];
    rows.forEach((questao) => {
      hashmap[questao.numeroQuestao]
        ? hashmap[questao.numeroQuestao].push(questao)
        : (hashmap[questao.numeroQuestao] = [questao]);
    });
    Object.keys(hashmap).forEach((key) => {
      let lastQuestionVersion = hashmap[key].reduce((prev, curr) => {
        return curr.versao > prev.versao ? curr : prev;
      });
      questoesFiltered.push(lastQuestionVersion);
    });

    response.json({ questoes: questoesFiltered, err });
  });
  db.close();
};

exports.getQuestaoById = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

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
};

exports.getQuestaoOpcoes = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Alternativa WHERE idQuestao = ? AND ativada=1";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idQuestao);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    let hashmap = {};
    let opcoesFiltered = [];
    rows.forEach((opcao) => {
      hashmap[opcao.numeroAlt]
        ? hashmap[opcao.numeroAlt].push(opcao)
        : (hashmap[opcao.numeroAlt] = [opcao]);
    });
    Object.keys(hashmap).forEach((key) => {
      let lastOpcaoVersion = hashmap[key].reduce((prev, curr) => {
        return curr.versao > prev.versao ? curr : prev;
      });
      opcoesFiltered.push(lastOpcaoVersion);
    });

    response.json({ opcoes: opcoesFiltered });
  });
  db.close();
};

exports.createQuestao = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Questao (texto, numeroQuestao, peso, idDominio, idAutor, idEixo, versao) VALUES(?, (SELECT (numeroQuestao + 1) FROM Questao ORDER BY numeroQuestao DESC), ?, ?, ?, ?, 1)";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.texto);
  // params.push(request.body.numeroQuestao);
  params.push(request.body.peso);
  params.push(request.body.idDominio);
  params.push(request.body.idAutor);
  params.push(request.body.idEixo);

  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questoes: rows });
  });
  db.close();
};

exports.updateQuestao = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

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
};

exports.disableQuestao = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "UPDATE Questao SET ativada=0 WHERE numeroQuestao=?;";

  // params' list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.body.numeroQuestao);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    if (err) {
      throw new Error(err);
    }
    response.json(rows);
  });
  db.close();
};
