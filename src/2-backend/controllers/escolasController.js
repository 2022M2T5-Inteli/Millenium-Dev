const sqlite3 = require("sqlite3").verbose();
const DBPATH = "./Database/mainDB.db";

exports.listEscolas = (request, response) => {
  response.json({ message: "Not Implemented!" });
};

exports.listEscolaById = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

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
};

exports.listEscolaQuestionarios = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

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
};

exports.listEscolaQuestionariosAbertos = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questionario WHERE idEscola = ? AND isComplete = 0";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idEscola);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questionarios: rows });
  });
  db.close();
};

exports.listEscolaQuestionariosConcluidos = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let db = new sqlite3.Database(DBPATH);
  let sql = "SELECT * FROM Questionario WHERE idEscola = ? AND isComplete = 1";

  // params list, replaces "?"
  let params = [];

  // add elements to the params list
  params.push(request.params.idEscola);
  db.all(sql, params, (err, rows) => {
    response.statusCode = 200;
    response.json({ questionarios: rows });
  });
  db.close();
};

exports.createEscola = (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let db = new sqlite3.Database(DBPATH);
  let sql =
    "INSERT INTO Escola(codeEscola, nome, idRede, endereco, cidade, numeroAlunos, numeroFuncionarios) Values(?,?,?,?,?,?,?);";

  let params = [];
  params.push(request.body.codeEscola);
  params.push(request.body.nome);
  params.push(request.body.idRede);
  params.push(request.body.endereco);
  params.push(request.body.cidade);
  params.push(request.body.numeroAlunos);
  params.push(request.body.numeroFuncionarios);

  db.all(sql, params, (err, rows) => {
    db.all("SELECT last_insert_rowid() as codeEscola", [], (_, rowFinal) => {
      response.statusCode = 200;
      response.json({ codeEscola: rowFinal[0].codeEscola, err });
    });
  });
};

exports.updateEscola = (request, response) => {
  response.json({ message: "Not implemented!" });
};

exports.deleteEscola = (request, response) => {
  response.json({ message: "Not implemented!" });
};
