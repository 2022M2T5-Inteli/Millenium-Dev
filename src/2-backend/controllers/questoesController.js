const DatabaseAsync = require("sqlite-async");
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

exports.listQuestoesByDominio = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questao WHERE idDominio = ? AND ativada=1";
  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idDominio);
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

exports.createQuestao = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = await DatabaseAsync.open(DBPATH);

  let sql =
    "INSERT INTO Questao (texto, numeroQuestao, peso, idDominio, idAutor, idEixo, versao) VALUES(?, ?, ?, ?, ?, ?, 1)";

  let lastNumberSql =
    "SELECT numeroQuestao FROM Questao ORDER BY numeroQuestao DESC";
  // params list, replaces "?"

  let lastNumber = await db.all(lastNumberSql, []);
  lastNumber = lastNumber[0] ? Number(lastNumber[0].numeroQuestao) + 1 : 1;
  let params = [];

  // add elements to the params list
  params.push(request.body.texto);
  params.push(lastNumber);
  params.push(request.body.peso);
  params.push(request.body.idDominio);
  params.push(request.body.idAutor);
  params.push(request.body.idEixo);

  const rows = await db.all(sql, params);
  response.statusCode = 200;
  response.json({ questoes: rows });
  db.close();
};

exports.updateQuestao = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sqlUpdate = "UPDATE Questao SET ativada=0 WHERE id=?";
  let sqlInsert =
    "INSERT INTO Questao (texto, numeroQuestao, peso, idDominio, idAutor, idEixo, versao) VALUES(?, ?, ?, ?, ?, ?,(SELECT (versao + 1) FROM Questao WHERE numeroQuestao=? ORDER BY versao DESC));";

  // params' list, replaces "?"
  let paramsUpdate = [];
  let paramsInsert = [];

  // add elements to the Update params list
  paramsUpdate.push(request.body.id);

  // add elements to the Insert params list
  paramsInsert.push(request.body.texto);
  paramsInsert.push(request.body.numeroQuestao);
  paramsInsert.push(request.body.peso);
  paramsInsert.push(request.body.idDominio);
  paramsInsert.push(request.body.idAutor);
  paramsInsert.push(request.body.idEixo);
  paramsInsert.push(request.body.numeroQuestao);

  db.all(sqlUpdate, paramsUpdate, (err, _) => {
    if (!err) {
      db.all(sqlInsert, paramsInsert, (err, rows) => {
        response.statusCode = 200;
        response.json(rows);
      });
    }
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
